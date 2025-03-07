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
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Fade
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import { styled } from '@mui/material/styles'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  padding: '32px',
  color: 'white',
  borderRadius: '16px',
  marginBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: 'none',
  '& .MuiTableCell-head': {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#1a237e'
  }
}))

// Data dummy untuk testing
const dummyData = [
  {
    id: 1,
    tanggal: '2024-03-20',
    nilai: 500000,
    keterangan: 'Pembayaran listrik kantor'
  },
  {
    id: 2,
    tanggal: '2024-03-19',
    nilai: 1000000,
    keterangan: 'Pembelian ATK'
  },
  {
    id: 3,
    tanggal: '2024-03-18',
    nilai: 2500000,
    keterangan: 'Perbaikan fasilitas desa'
  }
]

export default function Pengeluaran() {
  const [rows, setRows] = useState(dummyData)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    nilai: '',
    keterangan: ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      tanggal: '',
      nilai: '',
      keterangan: ''
    })
    setShowModal(true)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setFormData({
      tanggal: row.tanggal,
      nilai: row.nilai,
      keterangan: row.keterangan
    })
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setRows(rows.filter(row => row.id !== id))
      showAlertMessage('Data berhasil dihapus', 'success')
    }
  }

  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleSave = () => {
    if (!formData.tanggal || !formData.nilai || !formData.keterangan) {
      showAlertMessage('Semua field harus diisi', 'error')
      return
    }

    if (editingId) {
      setRows(rows.map(row => 
        row.id === editingId 
          ? { ...row, ...formData }
          : row
      ))
      showAlertMessage('Data berhasil diperbarui', 'success')
    } else {
      const newRow = {
        id: rows.length + 1,
        ...formData
      }
      setRows([...rows, newRow])
      showAlertMessage('Data berhasil ditambahkan', 'success')
    }
    setShowModal(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const totalPengeluaran = rows.reduce((sum, row) => sum + row.nilai, 0)

  return (
    <Box sx={{ padding: '24px' }}>
      <Fade in={showAlert}>
        <Alert 
          severity={alertType}
          sx={{ 
            position: 'fixed', 
            top: 24, 
            right: 24, 
            zIndex: 9999,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
            borderRadius: '12px'
          }}
        >
          {alertMessage}
        </Alert>
      </Fade>

      <HeaderBox>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Data Pengeluaran
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Pengeluaran: {formatCurrency(totalPengeluaran)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: 'white',
            color: '#1a237e',
            '&:hover': { 
              bgcolor: 'rgba(255,255,255,0.9)',
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
            },
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Tambah Pengeluaran
        </Button>
      </HeaderBox>

      <StyledCard>
        <CardContent sx={{ p: 0 }}>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Jumlah</TableCell>
                  <TableCell>Keterangan</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow 
                    key={row.id} 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: '#f8f9fa',
                        '& .action-buttons': {
                          opacity: 1
                        }
                      }
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.tanggal}</TableCell>
                    <TableCell sx={{ color: '#d32f2f', fontWeight: 600 }}>
                      {formatCurrency(row.nilai)}
                    </TableCell>
                    <TableCell>{row.keterangan}</TableCell>
                    <TableCell align="center">
                      <Box 
                        className="action-buttons"
                        sx={{ 
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center'
                        }}
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{
                              color: '#ed6c02',
                              '&:hover': { bgcolor: 'rgba(237, 108, 2, 0.1)' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.id)}
                            sx={{
                              color: '#d32f2f',
                              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <MoneyOffIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data pengeluaran
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </CardContent>
      </StyledCard>

      <Dialog 
        open={showModal} 
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          borderBottom: '1px solid #eee',
          color: '#1a237e',
          fontWeight: 600
        }}>
          {editingId ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Tanggal"
            name="tanggal"
            type="date"
            value={formData.tanggal}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Jumlah"
            name="nilai"
            type="number"
            value={formData.nilai}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1, color: '#666' }}>Rp</Typography>
            }}
          />
          <TextField
            label="Keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={() => setShowModal(false)} 
            sx={{ 
              color: '#666',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Batal
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{ 
              bgcolor: '#1a237e',
              '&:hover': { bgcolor: '#0d47a1' },
              borderRadius: '8px',
              px: 3
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
} 