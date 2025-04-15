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
  Avatar,
  TablePagination
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { styled } from '@mui/material/styles'
import { pengeluaranService } from '@/services/pengeluaranService'
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
  color: '#1a237e',
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
  color: '#1a237e',
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
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [isLoadingTotal, setIsLoadingTotal] = useState(true)

  // State untuk pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage])

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        setIsLoadingTotal(true)
        const total = await laporanService.getTotalPengeluaran()
        console.log('Fetched Total Pengeluaran:', total)
        setTotalPengeluaran(Number.isFinite(total) ? total : 0)
      } catch (error) {
        console.error('Gagal mengambil total pengeluaran:', error)
        setTotalPengeluaran(0)
        showAlertMessage('Gagal memuat total pengeluaran', 'error')
      } finally {
        setIsLoadingTotal(false)
      }
    }
    fetchTotal()
  }, [])

  // Cleanup previewUrl untuk mencegah memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await pengeluaranService.getAllPengeluaran(page + 1, rowsPerPage)
      const pengeluaranData = response.data.items.map(item => ({
        id: item.id_pengeluaran,
        tanggal: item.tanggal,
        nominal: item.nominal,
        keterangan: item.keterangan,
        nota: item.nota
      }))
      setRows(pengeluaranData)
      setTotalItems(response.data.total_items)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error('Error fetching data:', error)
      showAlertMessage('Gagal mengambil data: ' + error.message, 'error')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'nota') {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      const file = files[0]
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      if (file) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        setPreviewUrl('')
      }
    } else if (name === 'nominal') {
      const numericValue = value.replace(/\D/g, '')
      if (numericValue.length > 11) {
        showAlertMessage('Nominal terlalu besar (maksimal puluhan milyar)', 'error')
        return
      }
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }))
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
    const [datePart, timePart] = row.tanggal.split(' ')
    const [year, month, day] = datePart.split('-')
    const localDateTime = `${year}-${month}-${day}T${timePart}`
    setEditingId(row.id)
    setFormData({
      tanggal: localDateTime,
      nominal: row.nominal.toString(),
      keterangan: row.keterangan,
      nota: null
    })
    if (row.nota) {
      setPreviewUrl(`${UPLOAD_URL}${row.nota}`)
    } else {
      setPreviewUrl('')
    }
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!id) {
      showAlertMessage('Data tidak valid untuk dihapus', 'error')
      return
    }
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pengeluaran dengan No ${id}?`)) {
      return
    }
    try {
      setLoading(true)
      await pengeluaranService.deletePengeluaran(id)
      if (rows.length === 1 && page > 0) {
        setPage(page - 1)
      } else {
        await fetchData()
      }
      // Refresh total pengeluaran
      const total = await laporanService.getTotalPengeluaran()
      setTotalPengeluaran(Number.isFinite(total) ? total : 0)
      showAlertMessage(`Pengeluaran dengan No ${id} berhasil dihapus`, 'success')
    } catch (error) {
      console.error('Error deleting data:', error)
      showAlertMessage(`Gagal menghapus pengeluaran: ${error.message}`, 'error')
    } finally {
      setLoading(false)
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
      setLoading(true)
      // Validasi input
      if (!formData.tanggal) throw new Error('Tanggal harus diisi')
      if (!formData.nominal) throw new Error('Nominal harus diisi')
      if (!formData.keterangan) throw new Error('Keterangan harus diisi')
      if (!editingId && !formData.nota) throw new Error('Nota harus diupload')

      const dateObj = new Date(formData.tanggal)
      if (isNaN(dateObj.getTime())) throw new Error('Format tanggal tidak valid')

      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const year = dateObj.getFullYear()
      const hours = String(dateObj.getHours()).padStart(2, '0')
      const minutes = String(dateObj.getMinutes()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`

      const dataToSend = {
        tanggal: formattedDate,
        nominal: parseFloat(formData.nominal),
        keterangan: formData.keterangan.trim(),
        nota: formData.nota
      }

      let result
      if (editingId) {
        // Tidak kirim nota saat update kecuali ada file baru
        const { nota, ...updateData } = dataToSend
        result = await pengeluaranService.updatePengeluaran(editingId, formData.nota ? dataToSend : updateData)
      } else {
        result = await pengeluaranService.addPengeluaran(dataToSend)
      }

      showAlertMessage(result.message, 'success')
      setShowModal(false)
      await fetchData()
      // Refresh total pengeluaran
      const total = await laporanService.getTotalPengeluaran()
      setTotalPengeluaran(Number.isFinite(total) ? total : 0)
    } catch (error) {
      console.error('Error saving data:', error)
      showAlertMessage(error.message || 'Gagal menyimpan data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    const validAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(validAmount)
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-'
    try {
      const [datePart, timePart] = dateTimeString.split(' ')
      const [year, month, day] = datePart.split('-')
      const [hours, minutes] = timePart.split(':')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch (e) {
      console.error('Error formatting date:', e)
      return dateTimeString
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleClose = () => {
    setShowModal(false)
    setPreviewUrl('')
  }

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
            Data Pengeluaran
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
            Total Pengeluaran: {isLoadingTotal ? 'Memuat...' : formatCurrency(totalPengeluaran)}
          </Typography>
        </Box>
        <DesktopAddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Tambah Pengeluaran
        </DesktopAddButton>
      </HeaderBox>

      <AddButton
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAdd}
      >
        Tambah Pengeluaran
      </AddButton>

      <StyledCard>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ mb: 3, color: '#1a237e' }}>
            Kelola data pengeluaran desa dengan mudah
          </Typography>
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: 650 }}>
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
                        Tidak ada data pengeluaran
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{formatDateTime(row.tanggal)}</TableCell>
                      <TableCell sx={{ color: '#d32f2f', fontWeight: 600 }}>
                        {formatCurrency(row.nominal)}
                      </TableCell>
                      <TableCell>{row.keterangan}</TableCell>
                      <TableCell>
                        {row.nota ? (
                          <IconButton
                            onClick={() => window.open(`${UPLOAD_URL}${row.nota}`, '_blank')}
                            size="small"
                          >
                            <ReceiptIcon />
                          </IconButton>
                        ) : (
                          <Typography variant="caption">Tidak ada</Typography>
                        )}
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
                                color: '#1a237e',
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
                              onClick={() => handleDelete(row.id)}
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Baris per halaman:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} dari ${count}`}
              sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                '& .MuiTablePagination-toolbar': {
                  padding: '16px'
                }
              }}
            />
          </Box>
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
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
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
              Edit Pengeluaran
            </>
          ) : (
            <>
              <AddIcon sx={{ fontSize: 28 }} />
              Tambah Pengeluaran
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
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#1a237e' }}>
              Informasi Pengeluaran
            </Typography>
            <Divider />
          </Box>

          <TextField
            label="Tanggal dan Waktu"
            name="tanggal"
            type="datetime-local"
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
                  borderColor: '#1a237e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a237e',
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
            inputProps={{
              maxLength: 11,
              pattern: '[0-9]*'
            }}
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
                    borderColor: '#1a237e',
                  }
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a237e',
                    borderWidth: '2px',
                  }
                }
              }
            }}
            placeholder="Contoh: 1.000.000"
          />

          <TextField
            label="Keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            fullWidth
            required
            multiline
            rows={4}
            placeholder="Masukkan detail keterangan pengeluaran"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#1a237e',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a237e',
                  borderWidth: '2px',
                }
              }
            }}
          />

          <Box sx={{ mb: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                fontWeight: 500,
                color: theme => theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <ReceiptIcon sx={{ fontSize: 20 }} />
              Upload Nota {editingId ? '(Opsional)' : '*'}
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: theme => theme.palette.divider,
                borderRadius: '12px',
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#1a237e',
                  bgcolor: 'rgba(26, 35, 126, 0.04)'
                }
              }}
            >
              <input
                accept="image/*"
                type="file"
                name="nota"
                onChange={handleInputChange}
                style={{ display: 'none' }}
                id="nota-upload"
                aria-label="Upload nota pengeluaran"
              />
              <label htmlFor="nota-upload" style={{ cursor: 'pointer' }}>
                {previewUrl ? (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={previewUrl}
                      alt="Preview Nota"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px'
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 2,
                        color: 'text.secondary'
                      }}
                    >
                      Klik untuk mengganti gambar
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ py: 3 }}>
                    <ReceiptIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Klik atau seret file nota ke sini
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Format yang didukung: JPG, PNG, JPEG (Maks. 5MB)
                    </Typography>
                  </Box>
                )}
              </label>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          px: 4,
          py: 3,
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          gap: 2,
          bgcolor: 'rgba(0, 0, 0, 0.02)'
        }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#1a237e',
                color: '#1a237e',
                bgcolor: 'rgba(26, 35, 126, 0.04)'
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
              bgcolor: '#1a237e',
              '&:hover': {
                bgcolor: '#0d47a1'
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
                <ReceiptIcon />
                Simpan
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}