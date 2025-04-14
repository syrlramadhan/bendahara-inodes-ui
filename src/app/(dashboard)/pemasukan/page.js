'use client'

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
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
  MenuItem
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { styled } from '@mui/material/styles'
import { pemasukanService } from '@/services/pemasukanService'
import SaveIcon from '@mui/icons-material/Save'

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px',
  marginBottom: { xs: '8px', sm: '24px' },
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
}))

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#2e7d32',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px',
  width: '100%',
  fontSize: '1rem',
  marginBottom: '16px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
  },
  [theme.breakpoints.up('sm')]: {
    display: 'none'
  }
}))

const DesktopAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#2e7d32',
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  }
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
      const response = await pemasukanService.getAllPemasukan()
      setRows(response || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      showAlertMessage('Gagal mengambil data pemasukan', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nominal') {
      // Remove non-digit characters
      const numericValue = value.replace(/\D/g, '');
      
      // Limit to 11 digits (tens of billions)
      if (numericValue.length > 11) {
        showAlertMessage('Nominal terlalu besar (maksimal puluhan milyar)', 'error');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [name]: numericValue
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
    setEditingId(row.id_pemasukan)
    setFormData({
      tanggal: row.tanggal,
      nominal: row.nominal.toString(),
      keterangan: row.keterangan,
      kategori: row.kategori || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!id) {
      console.log('Invalid data:', { id });
      showAlertMessage('Data tidak valid untuk dihapus (ID tidak ditemukan)', 'error');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus pemasukan dengan ID ${id}?`)) {
      return;
    }

    try {
      setLoading(true);
      await pemasukanService.deletePemasukan(id);
      await fetchData();
      showAlertMessage(`Pemasukan dengan ID ${id} berhasil dihapus`, 'success');
    } catch (error) {
      console.error('Error deleting data:', error);
      showAlertMessage(`Gagal menghapus pemasukan: ${error.message}`, 'error');
    } finally {
      setLoading(false);
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
      // Validation
      if (!formData.tanggal) {
        showAlertMessage('Tanggal harus diisi', 'error');
        return;
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.tanggal)) {
        showAlertMessage('Format tanggal tidak valid (YYYY-MM-DD)', 'error');
        return;
      }

      if (!formData.nominal || isNaN(formData.nominal) || parseFloat(formData.nominal) <= 0) {
        showAlertMessage('Nominal harus berupa angka positif', 'error');
        return;
      }

      if (!formData.kategori || formData.kategori.trim() === '') {
        showAlertMessage('Kategori tidak boleh kosong', 'error');
        return;
      }

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
        await pemasukanService.updatePemasukan(editingId, data);
        showAlertMessage('Data pemasukan berhasil diperbarui', 'success');
      } else {
        await pemasukanService.addPemasukan(data);
        showAlertMessage('Data pemasukan berhasil ditambahkan', 'success');
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      showAlertMessage(error.message || 'Gagal menyimpan data pemasukan', 'error');
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

  const totalPemasukan = rows.reduce((sum, row) => sum + (row.nominal || 0), 0)

  return (
    <Box sx={{ 
      padding: '24px',
      mt: { xs: '64px', sm: '80px' }
    }}>
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
        <DesktopAddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Tambah Pemasukan
        </DesktopAddButton>
      </HeaderBox>

      <AddButton
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAdd}
      >
        Tambah Pemasukan
      </AddButton>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 3, color: '#2e7d32' }}>
            Kelola data pemasukan desa dengan mudah
          </Typography>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 650 }}>
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
                      key={row.id_pemasukan} 
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
                      <TableCell sx={{ 
                        color: '#2e7d32', 
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {formatCurrency(row.nominal)}
                      </TableCell>
                      <TableCell sx={{ 
                        maxWidth: { xs: '120px', sm: '200px' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {row.keterangan}
                      </TableCell>
                      <TableCell align="center">
                        <Box 
                          className="action-buttons"
                          sx={{ 
                            opacity: { xs: 1, sm: 0.5 },
                            transition: 'opacity 0.2s',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(row)}
                              sx={{ 
                                color: '#2e7d32',
                                width: { xs: '35px', sm: '30px' },
                                height: { xs: '35px', sm: '30px' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDelete(row.id_pemasukan)}
                              sx={{ 
                                color: '#d32f2f',
                                width: { xs: '35px', sm: '30px' },
                                height: { xs: '35px', sm: '30px' }
                              }}
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
          </Box>
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            maxHeight: '90vh',
            margin: '16px',
            width: 'calc(100% - 32px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          pt: 3,
          px: 3,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          '& .MuiTypography-root': {
            fontSize: '1.5rem',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }
        }}>
          {editingId ? (
            <>
              <EditIcon sx={{ fontSize: 28 }} />
              Edit Pemasukan
            </>
          ) : (
            <>
              <AddIcon sx={{ fontSize: 28 }} />
              Tambah Pemasukan
            </>
          )}
        </DialogTitle>

        <DialogContent 
          sx={{ 
            py: 4,
            px: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#666',
              },
            },
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#2e7d32' }}>
              Informasi Pemasukan
            </Typography>
            <Divider />
          </Box>

          <TextField
            label="Tanggal"
            name="tanggal"
            type="date"
            value={formData.tanggal}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{ 
              shrink: true,
              sx: { fontWeight: 500 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32',
                  borderWidth: '2px',
                }
              }
            }}
          />
          
          <TextField
            label="Jumlah"
            name="nominal"
            type="text"
            value={formData.nominal ? parseInt(formData.nominal).toLocaleString('id-ID') : ''}
            onChange={handleInputChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <Typography sx={{ 
                  mr: 1, 
                  color: '#666',
                  fontWeight: 500 
                }}>
                  Rp
                </Typography>
              ),
              sx: {
                borderRadius: '12px',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2e7d32',
                  }
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2e7d32',
                    borderWidth: '2px',
                  }
                }
              }
            }}
            placeholder="Contoh: 1.000.000"
          />

          <TextField
            label="Kategori"
            name="kategori"
            select
            value={formData.kategori}
            onChange={handleInputChange}
            fullWidth
            required
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 250,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32',
                  borderWidth: '2px',
                }
              }
            }}
          >
            <MenuItem value="">Pilih Kategori</MenuItem>
            <MenuItem value="Pajak">Pajak</MenuItem>
            <MenuItem value="Retribusi">Retribusi</MenuItem>
            <MenuItem value="Dana Desa">Dana Desa</MenuItem>
            <MenuItem value="Bantuan">Bantuan</MenuItem>
            <MenuItem value="Lainnya">Lainnya</MenuItem>
          </TextField>

          <TextField
            label="Keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            fullWidth
            required
            multiline
            rows={4}
            placeholder="Masukkan detail keterangan pemasukan"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2e7d32',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32',
                  borderWidth: '2px',
                }
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ 
          px: 4,
          py: 3,
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          gap: 2,
          bgcolor: 'rgba(0, 0, 0, 0.02)'
        }}>
          <Button 
            onClick={() => setShowModal(false)} 
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#2e7d32',
                color: '#2e7d32',
                bgcolor: 'rgba(46, 125, 50, 0.04)'
              },
              px: 3,
              py: 1
            }}
          >
            Batal
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            sx={{ 
              borderRadius: '10px',
              bgcolor: '#2e7d32',
              '&:hover': { 
                bgcolor: '#1b5e20'
              },
              px: 3,
              py: 1,
              gap: 1
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" />
                Menyimpan...
              </>
            ) : (
              <>
                <SaveIcon />
                Simpan
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}