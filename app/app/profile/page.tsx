export default function ProfilePage() {
    const user = {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0123456789',
      role: 'Admin',
    };
  
    return (
      <div style={{
        maxWidth: 480,
        margin: '3rem auto',
        padding: '2rem',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Thông tin cá nhân</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Họ và tên</label>
          <p style={{
            marginTop: 4,
            padding: '0.5rem 1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: 6,
            border: '1px solid #ddd',
            color: '#222',
          }}>{user.name}</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Email</label>
          <p style={{
            marginTop: 4,
            padding: '0.5rem 1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: 6,
            border: '1px solid #ddd',
            color: '#222',
          }}>{user.email}</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Số điện thoại</label>
          <p style={{
            marginTop: 4,
            padding: '0.5rem 1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: 6,
            border: '1px solid #ddd',
            color: '#222',
          }}>{user.phone}</p>
        </div>
        <div>
          <label style={{ fontWeight: '600', color: '#555' }}>Vai trò</label>
          <p style={{
            marginTop: 4,
            padding: '0.5rem 1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: 6,
            border: '1px solid #ddd',
            color: '#222',
          }}>{user.role}</p>
        </div>
      </div>
    );
  }