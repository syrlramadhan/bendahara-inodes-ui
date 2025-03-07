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
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Fade,
  CircularProgress,
  Avatar
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { styled } from '@mui/material/styles'
import { laporanService } from '@/services/laporanService'
import { UPLOAD_URL } from '@/config/api'

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

export default function Pengeluaran() {
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    nominal: '',
    keterangan: '',
    nota: null
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await laporanService.getAllLaporan()
      const pengeluaranData = response.filter(item => item.pengeluaran > 0)
      setRows(pengeluaranData)
    } catch (error) {
      console.error('Error fetching data:', error)
      showAlertMessage('Gagal mengambil data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'nota') {
      const file = files[0]
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      // Buat preview URL untuk gambar
      if (file) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      tanggal: '',
      nominal: '',
      keterangan: '',
      nota: null
    })
    setPreviewUrl('')
    setShowModal(true)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setFormData({
      tanggal: row.tanggal,
      nominal: row.pengeluaran,
      keterangan: row.keterangan,
      nota: null
    })
    // Set preview URL jika ada nota
    if (row.nota) {
      setPreviewUrl(`${UPLOAD_URL}${row.nota}`)
    } else {
      setPreviewUrl('')
    }
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await laporanService.deleteLaporan(id)
        showAlertMessage('Data berhasil dihapus', 'success')
        fetchData()
      } catch (error) {
        console.error('Error deleting data:', error)
        showAlertMessage('Gagal menghapus data', 'error')
      }
    }
  }

  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleSave = async () => {
    if (!formData.tanggal || !formData.nominal || !formData.keterangan) {
      showAlertMessage('Semua field harus diisi', 'error')
      return
    }

    // Validasi nota untuk penambahan data baru
    if (!editingId && !formData.nota) {
      showAlertMessage('Nota harus diupload', 'error')
      return
    }

    try {
      const data = {
        tanggal: formData.tanggal,
        nominal: formData.nominal,
        keterangan: formData.keterangan,
        nota: formData.nota
      }

      if (editingId) {
        // Jika edit dan ada nota baru
        if (formData.nota) {
          await laporanService.updateLaporan(editingId, data)
        } else {
          // Jika edit tanpa mengubah nota
          const { nota, ...dataWithoutNota } = data
          await laporanService.updateLaporan(editingId, dataWithoutNota)
        }
        showAlertMessage('Data berhasil diperbarui', 'success')
      } else {
        await laporanService.addPengeluaran(data)
        showAlertMessage('Data berhasil ditambahkan', 'success')
      }
      
      setShowModal(false)
      fetchData()
    } catch (error) {
      console.error('Error saving data:', error)
      showAlertMessage(error.message || 'Gagal menyimpan data', 'error')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const totalPengeluaran = rows.reduce((sum, row) => sum + (row.pengeluaran || 0), 0)

  const handleClose = () => {
    setShowModal(false)
    setPreviewUrl('')
  }

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
        <CardContent>
          <Typography variant="h4" component="div" sx={{ mb: 2 }}>
            Data Pengeluaran
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Kelola data pengeluaran desa dengan mudah
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleAdd}
            sx={{ mb: 3 }}
          >
            Tambah Pengeluaran
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Tanggal</TableCell>
                  <TableCell>Jumlah</TableCell>
                  <TableCell>Keterangan</TableCell>
                  <TableCell>Nota</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <MoneyOffIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data pengeluaran
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, index) => (
                    <TableRow 
                      key={`${row.tanggal}-${index}`} 
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
                        {formatCurrency(row.pengeluaran)}
                      </TableCell>
                      <TableCell>{row.keterangan}</TableCell>
                      <TableCell>
                        {row.nota ? (
                          <IconButton
                            size="small"
                            onClick={() => window.open(`${UPLOAD_URL}${row.nota}`, '_blank')}
                            sx={{ color: '#1a237e' }}
                          >
                            <ReceiptIcon />
                          </IconButton>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Tidak ada nota
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box 
                          className="action-buttons"
                          sx={{ 
                            opacity: 0.5,
                            transition: 'opacity 0.2s'
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(row)}
                              sx={{ color: '#1a237e', mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(row.id)}
                              sx={{ color: '#d32f2f' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>

      <Dialog 
        open={showModal} 
        onClose={handleClose}
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
        <DialogContent sx={{ py: 3 }}>
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
            name="nominal"
            type="number"
            value={formData.nominal}
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
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Upload Nota *
            </Typography>
            <input
              accept="image/*"
              type="file"
              name="nota"
              onChange={handleInputChange}
              style={{ display: 'none' }}
              id="nota-upload"
            />
            <label htmlFor="nota-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{
                  borderColor: '#ddd',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#1a237e',
                    color: '#1a237e'
                  }
                }}
              >
                {formData.nota ? formData.nota.name : 'Pilih File Nota'}
              </Button>
            </label>
            {previewUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={previewUrl}
                  alt="Preview Nota"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eee' }}>
          <Button 
            onClick={handleClose}
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