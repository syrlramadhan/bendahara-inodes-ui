'use client'

import { useState } from 'react'
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
  Box,
  Typography
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { Card } from '@/components/ui/card'
import { colors } from '@/styles/colors'

export default function Pemasukan() {
  const [rows, setRows] = useState([
    {
      id: 1,
      tanggal: '2024-02-20',
      kategori: 'Pajak',
      keterangan: 'Pajak Bumi dan Bangunan',
      jumlah: 2500000
    },
    // Data dummy untuk testing
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    kategori: '',
    keterangan: '',
    jumlah: ''
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      tanggal: '',
      kategori: '',
      keterangan: '',
      jumlah: ''
    })
    setShowModal(true)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setFormData(row)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setRows(rows.filter(row => row.id !== id))
    }
  }

  const handleSubmit = () => {
    if (editingId) {
      setRows(rows.map(row => 
        row.id === editingId ? { ...formData, id: editingId } : row
      ))
    } else {
      setRows([...rows, { ...formData, id: rows.length + 1 }])
    }
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: colors.text.primary }}>
          Data Pemasukan
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: colors.primary.main,
            '&:hover': {
              bgcolor: colors.primary.dark
            }
          }}
        >
          Tambah Pemasukan
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Keterangan</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.tanggal}</TableCell>
                  <TableCell>{row.kategori}</TableCell>
                  <TableCell>{row.keterangan}</TableCell>
                  <TableCell>Rp {row.jumlah.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(row)}
                        sx={{
                          bgcolor: colors.warning.main,
                          '&:hover': {
                            bgcolor: colors.warning.dark
                          }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(row.id)}
                        sx={{
                          bgcolor: colors.error.main,
                          '&:hover': {
                            bgcolor: colors.error.dark
                          }
                        }}
                      >
                        Hapus
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan'}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tanggal"
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleInputChange}
            fullWidth
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
          <TextField
            margin="dense"
            label="Jumlah"
            name="jumlah"
            type="number"
            value={formData.jumlah}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
} 