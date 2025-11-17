// Componente de debug para verificar se o React está funcionando
const DebugInfo = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ff6b6b',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      zIndex: 9999,
      fontSize: '14px'
    }}>
      ⚠️ MODO DEBUG: Se você vê isso, o React está funcionando!
    </div>
  );
};

export default DebugInfo;

