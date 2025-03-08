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
  CircularProgress
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { styled } from '@mui/material/styles'
import { laporanService } from '@/services/laporanService'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
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
    color: '#2e7d32'
  }
}))

export default function Pemasukan() {
  const [rows, setRows] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    tanggal: '',
    nominal: '',
    keterangan: '',
    kategori: ''
  })
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('success')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await laporanService.getAllLaporan()
      const pemasukanData = response.filter(item => item.pemasukan > 0)
      setRows(pemasukanData)
    } catch (error) {
      console.error('Error fetching data:', error)
      showAlertMessage('Gagal mengambil data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nominal') {
      // Hapus semua karakter non-digit
      const numericValue = value.replace(/\D/g, '');
      
      // Batasi maksimal 11 digit (puluhan milyar)
      if (numericValue.length > 11) {
        showAlertMessage('Nominal terlalu besar (maksimal puluhan milyar)', 'error');
        return;
      }

      // Format dengan separator ribuan
      const formattedValue = numericValue === '' ? '' : parseInt(numericValue).toLocaleString('id-ID');
      
      setFormData(prev => ({
        ...prev,
        [name]: numericValue // Simpan nilai numerik tanpa format
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      tanggal: '',
      nominal: '',
      keterangan: '',
      kategori: ''
    })
    setShowModal(true)
  }

  const handleEdit = (row) => {
    setEditingId(row.id)
    setFormData({
      tanggal: row.tanggal,
      nominal: row.pemasukan,
      keterangan: row.keterangan,
      kategori: row.kategori || ''
    })
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
    try {
      // Validasi tanggal
      if (!formData.tanggal) {
        showAlertMessage('Tanggal harus diisi', 'error');
        return;
      }

      // Validasi format tanggal
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.tanggal)) {
        showAlertMessage('Format tanggal tidak valid (YYYY-MM-DD)', 'error');
        return;
      }

      // Validasi nominal
      if (!formData.nominal || isNaN(formData.nominal) || parseFloat(formData.nominal) <= 0) {
        showAlertMessage('Nominal harus berupa angka positif', 'error');
        return;
      }

      // Validasi kategori
      if (!formData.kategori || formData.kategori.trim() === '') {
        showAlertMessage('Kategori tidak boleh kosong', 'error');
        return;
      }

      // Validasi keterangan
      if (!formData.keterangan || formData.keterangan.trim() === '') {
        showAlertMessage('Keterangan tidak boleh kosong', 'error');
        return;
      }

      setLoading(true);

      const data = {
        tanggal: formData.tanggal,
        nominal: parseFloat(formData.nominal),
        kategori: formData.kategori.trim(),
        keterangan: formData.keterangan.trim()
      };

      if (editingId) {
        await laporanService.updateLaporan(editingId, {
          ...data,
          jenis: 'Pemasukan'
        });
        showAlertMessage('Data berhasil diperbarui', 'success');
      } else {
        await laporanService.addPemasukan(data);
        showAlertMessage('Data berhasil ditambahkan', 'success');
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      showAlertMessage(error.message || 'Gagal menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const totalPemasukan = rows.reduce((sum, row) => sum + (row.pemasukan || 0), 0)

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
            Data Pemasukan
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Pemasukan: {formatCurrency(totalPemasukan)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: 'white',
            color: '#2e7d32',
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
          Tambah Pemasukan
        </Button>
      </HeaderBox>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 3, color: '#2e7d32' }}>
            Kelola data pemasukan desa dengan mudah
          </Typography>
          <TableContainer>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <AccountBalanceIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        Belum ada data pemasukan
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
                      <TableCell sx={{ color: '#2e7d32', fontWeight: 600 }}>
                        {formatCurrency(row.pemasukan)}
                      </TableCell>
                      <TableCell>{row.keterangan}</TableCell>
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
                              sx={{ color: '#2e7d32', mr: 1 }}
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
          color: '#2e7d32',
          fontWeight: 600
        }}>
          {editingId ? 'Edit Pemasukan' : 'Tambah Pemasukan'}
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
            type="text"
            value={formData.nominal ? parseInt(formData.nominal).toLocaleString('id-ID') : ''}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1, color: '#666' }}>Rp</Typography>
            }}
            placeholder="Contoh: 1.000.000"
          />
          <TextField
            label="Kategori"
            name="kategori"
            value={formData.kategori}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Contoh: Pajak, Retribusi, dll"
          />
          <TextField
            label="Keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            placeholder="Masukkan detail keterangan pemasukan"
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
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' },
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