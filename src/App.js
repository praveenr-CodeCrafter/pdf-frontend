import logo from './logo.svg';
import './index.css';
import PdfToExcel from './components/PdfToExcel';

function App() {
  return (
    // <div className="App">
    //   <PdfToExcel/>
    // </div>
    <div className='min-h-screen flex flex-col items-center justify-center' >
      <div className='container'>
        <PdfToExcel />
      </div>
  </div>
  );
}

export default App;
