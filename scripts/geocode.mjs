import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function geocode(address, city) {
  const q = encodeURIComponent(`${address} ${city} Belgium`)
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MonGaragiste/1.0' },
    })
    const data = await res.json()
    if (data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
  } catch (err) {
    console.error(`Geocoding error for "${address} ${city}":`, err)
  }
  return null
}

async function main() {
  const garages = await prisma.garage.findMany({
    where: {
      OR: [{ lat: null }, { lng: null }],
    },
    select: { id: true, address: true, city: true },
  })

  console.log(`Found ${garages.length} garage(s) without coordinates.`)

  for (const garage of garages) {
    console.log(`Geocoding: ${garage.address}, ${garage.city}...`)
    const coords = await geocode(garage.address, garage.city)
    if (coords) {
      await prisma.garage.update({
        where: { id: garage.id },
        data: { lat: coords.lat, lng: coords.lng },
      })
      console.log(`  -> lat=${coords.lat}, lng=${coords.lng}`)
    } else {
      console.log(`  -> not found`)
    }
    // Respect Nominatim rate limit: 1 req/s
    await sleep(1100)
  }

  console.log('Done.')
  await prisma.$disconnect()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
