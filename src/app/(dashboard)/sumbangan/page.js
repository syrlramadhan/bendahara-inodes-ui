'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { API_ENDPOINTS, getHeaders } from '@/config/api'

export default function Sumbangan() {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [formData, setFormData] = useState({
    no: '',
    tanggal: '',
    nama: '',
    angkatan: '',
    notaImage: null,
    nilai: '',
    keterangan: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
        if (!token) {
          router.push('/authentication/sign-in')
          return
        }

        const response = await fetch(API_ENDPOINTS.SUMBANGAN_GET_ALL, {
          method: 'GET',
          headers: getHeaders(token),
        })
        const result = await response.json()
        setRows(result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      notaImage: e.target.files[0]
    }))
  }

  const handleEditRow = (index) => {
    setEditIndex(index)
    setFormData(rows[index])
    setShowModal(true)
  }

  const handleSaveChanges = async () => {
    if (!formData.tanggal) {
      alert("Harap mengisi tanggal")
      return
    }
    if (!formData.nama) {
      alert("Harap mengisi Nama")
      return
    }
    if (!formData.angkatan) {
      alert("Harap mengisi angkatan")
      return
    }
    if (!formData.nilai) {
      alert("Harap mengisi nilai")
      return
    }
    if (!formData.keterangan) {
      alert("Harap mengisi keterangan")
      return
    }

    const newFormData = new FormData()
    let url = formData.No 
      ? API_ENDPOINTS.SUMBANGAN_UPDATE
      : API_ENDPOINTS.SUMBANGAN_ADD

    if (!formData.No && !formData.notaImage) {
      alert("Harap mengisi image")
      return
    }

    if (formData.No) {
      newFormData.append('no', formData.No)
    }
    
    newFormData.append('tanggal', formData.tanggal)
    newFormData.append('nama', formData.nama)
    newFormData.append('angkatan', formData.angkatan)
    newFormData.append('nota', formData.notaImage ? formData.notaImage.name : formData.nota)
    newFormData.append('nilai', formData.nilai)
    newFormData.append('keterangan', formData.keterangan)
    if (formData.notaImage) {
      newFormData.append('notaImage', formData.notaImage)
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: newFormData,
      })

      if (!response.ok) {
        throw new Error('Failed to send data')
      }

      const result = await response.json()
      console.log('Data sent successfully:', result)
      resetModal()
      
      // Refresh data
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
      const refreshResponse = await fetch(API_ENDPOINTS.SUMBANGAN_GET_ALL, {
        headers: getHeaders(token),
      })
      const refreshData = await refreshResponse.json()
      setRows(refreshData)
    } catch (error) {
      console.error('Error sending data:', error)
    }
  }

  const resetModal = () => {
    setFormData({
      no: '',
      tanggal: '',
      nama: '',
      angkatan: '',
      notaImage: null,
      nilai: '',
      keterangan: '',
    })
    setShowModal(false)
  }

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={() => setShowModal(true)}
        sx={{ mb: 3 }}
      >
        Tambah Data
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Angkatan</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Jumlah</TableCell>
              <TableCell>Keterangan</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.No}</TableCell>
                <TableCell>{row.tanggal}</TableCell>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.angkatan}</TableCell>
                <TableCell>
                  {row.nota ? (
                    <Box sx={{ width: 50, height: 50, position: 'relative' }}>
                      <Image
                        src={API_ENDPOINTS.SUMBANGAN_IMAGE(row.nota)}
                        alt="Nota"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  ) : 'No Image'}
                </TableCell>
                <TableCell>Rp {row.nilai}</TableCell>
                <TableCell>{row.keterangan}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleEditRow(index)}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={showModal} 
        onClose={resetModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex !== null ? 'Edit Data' : 'Tambah Data'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tanggal"
            name="tanggal"
            type="date"
            value={formData.tanggal}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Nama"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Angkatan"
            name="angkatan"
            value={formData.angkatan}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            type="file"
            name="notaImage"
            onChange={handleImageChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Nilai"
            name="nilai"
            value={formData.nilai}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            margin="dense"
            label="Keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetModal}>Batal</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
} 