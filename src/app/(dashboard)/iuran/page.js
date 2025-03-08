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
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'
import { API_ENDPOINTS, getHeaders } from '@/config/api'

export default function Iuran() {
  const router = useRouter()
  const [rows, setRows] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [formData, setFormData] = useState({
    bulan: '',
    no: '',
    nama: '',
    minggu1: '',
    minggu2: '',
    minggu3: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
        if (!token) {
          router.push('/authentication/sign-in')
          return
        }

        const response = await fetch(API_ENDPOINTS.IURAN_GET_ALL, {
          method: 'GET',
          headers: getHeaders(token),
        })
        const result = await response.json()

        const formattedData = {}
        result.forEach((item) => {
          const bulan = item.bulan.toLowerCase()
          if (!formattedData[bulan]) {
            formattedData[bulan] = []
          }

          formattedData[bulan].push({
            bulan: bulan,
            no: item.no,
            nama: item.nama,
            minggu1: item.minggu1.Int16,
            minggu2: item.minggu2.Int16,
            minggu3: item.minggu3.Int16,
          })
        })

        setRows(formattedData)
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

  const handleEditRow = (bulan, index) => {
    setEditIndex(index)
    setFormData(rows[bulan][index])
    setShowModal(true)
  }

  const handleSaveChanges = async () => {
    const updatedFormData = {
      ...formData,
      minggu1: parseInt(formData.minggu1),
      minggu2: parseInt(formData.minggu2),
      minggu3: parseInt(formData.minggu3),
    }

    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
      if (!token) {
        router.push('/authentication/sign-in')
        return
      }

      const response = await fetch(API_ENDPOINTS.IURAN_UPDATE, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(updatedFormData),
      })

      if (!response.ok) {
        throw new Error('Failed to update data')
      }

      const updatedData = await response.json()
      console.log('Data updated successfully:', updatedData)
      setShowModal(false)
      
      // Refresh data
      const refreshResponse = await fetch(API_ENDPOINTS.IURAN_GET_ALL, {
        headers: getHeaders(token),
      })
      const refreshData = await refreshResponse.json()
      const formattedData = {}
      refreshData.forEach((item) => {
        const bulan = item.bulan.toLowerCase()
        if (!formattedData[bulan]) {
          formattedData[bulan] = []
        }
        formattedData[bulan].push({
          bulan: bulan,
          no: item.no,
          nama: item.nama,
          minggu1: item.minggu1.Int16,
          minggu2: item.minggu2.Int16,
          minggu3: item.minggu3.Int16,
        })
      })
      setRows(formattedData)
    } catch (error) {
      console.error('Error updating data:', error)
    }
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

      {Object.keys(rows).map((bulan, index) => (
        <TableContainer key={index} component={Paper} sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              textTransform: 'capitalize'
            }}
          >
            {bulan} 2024
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Minggu 1</TableCell>
                <TableCell>Minggu 2</TableCell>
                <TableCell>Minggu 3</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows[bulan].map((row, idx) => (
                <TableRow key={bulan + idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{row.nama}</TableCell>
                  <TableCell>Rp.{row.minggu1}</TableCell>
                  <TableCell>Rp.{row.minggu2}</TableCell>
                  <TableCell>Rp.{row.minggu3}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handleEditRow(bulan, idx)}
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
      ))}

      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editIndex !== null ? 'Edit Data' : 'Tambah Data'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="No"
            name="no"
            value={formData.no}
            onChange={handleInputChange}
            fullWidth
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
            label="Minggu 1"
            name="minggu1"
            value={formData.minggu1}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            margin="dense"
            label="Minggu 2"
            name="minggu2"
            value={formData.minggu2}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
          <TextField
            margin="dense"
            label="Minggu 3"
            name="minggu3"
            value={formData.minggu3}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Batal</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
} 