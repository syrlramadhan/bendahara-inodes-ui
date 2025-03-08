import { NextResponse } from 'next/server'
import { API_ENDPOINTS, getHeaders } from '@/config/api'

const cloneIuran = async (token, data) => {
  const response = await fetch(API_ENDPOINTS.IURAN_ADD, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data)
  })
  return response.json()
}

const cloneSumbangan = async (token, data) => {
  const formData = new FormData()
  formData.append('tanggal', data.tanggal)
  formData.append('nama', data.nama)
  formData.append('angkatan', data.angkatan)
  formData.append('nota', data.nota)
  formData.append('nilai', data.nilai)
  formData.append('keterangan', data.keterangan)

  const response = await fetch(API_ENDPOINTS.SUMBANGAN_ADD, {
    method: 'POST',
    body: formData
  })
  return response.json()
}

const clonePengeluaran = async (token, data) => {
  const formData = new FormData()
  formData.append('tanggal', data.tanggal)
  formData.append('nota', data.nota)
  formData.append('nilai', data.nilai)
  formData.append('keterangan', data.keterangan)

  const response = await fetch(API_ENDPOINTS.PENGELUARAN_ADD, {
    method: 'POST',
    body: formData
  })
  return response.json()
}

export async function POST(request) {
  try {
    const { token, type, sourceData } = await request.json()

    const results = []
    const namaSample = ['Andi', 'Budi', 'Citra', 'Deni', 'Eka', 'Fajar', 'Gita', 'Hadi', 'Indah', 'Joko']
    const angkatanSample = ['2019', '2020', '2021', '2022']
    const keteranganSample = ['Iuran Bulanan', 'Sumbangan Sukarela', 'Pengeluaran Rutin', 'Kegiatan Sosial']

    for (let i = 0; i < 100; i++) {
      const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split('T')[0]
      
      const randomNama = namaSample[Math.floor(Math.random() * namaSample.length)]
      const randomAngkatan = angkatanSample[Math.floor(Math.random() * angkatanSample.length)]
      const randomKeterangan = keteranganSample[Math.floor(Math.random() * keteranganSample.length)]
      const randomNilai = Math.floor(Math.random() * 1000000) + 100000

      let cloneData
      switch (type) {
        case 'iuran':
          cloneData = {
            bulan: new Date(randomDate).toLocaleString('id-ID', { month: 'long' }).toLowerCase(),
            nama: randomNama,
            minggu1: Math.floor(Math.random() * 50000) + 10000,
            minggu2: Math.floor(Math.random() * 50000) + 10000,
            minggu3: Math.floor(Math.random() * 50000) + 10000,
          }
          results.push(await cloneIuran(token, cloneData))
          break

        case 'sumbangan':
          cloneData = {
            tanggal: randomDate,
            nama: randomNama,
            angkatan: randomAngkatan,
            nota: 'sample.jpg',
            nilai: randomNilai,
            keterangan: randomKeterangan
          }
          results.push(await cloneSumbangan(token, cloneData))
          break

        case 'pengeluaran':
          cloneData = {
            tanggal: randomDate,
            nota: 'sample.jpg',
            nilai: randomNilai,
            keterangan: randomKeterangan
          }
          results.push(await clonePengeluaran(token, cloneData))
          break
      }
    }

    return NextResponse.json({ 
      message: `Berhasil mengkloning 100 data ${type}`,
      results 
    })
  } catch (error) {
    console.error('Error cloning data:', error)
    return NextResponse.json({ error: 'Failed to clone data' }, { status: 500 })
  }
} 