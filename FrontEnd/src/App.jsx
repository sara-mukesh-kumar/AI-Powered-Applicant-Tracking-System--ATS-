import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ApplicantDashboard from './components/Applicant/ApplicantDashboard'
import AdminDashboard from './components/Admin/admindashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h2>Zaalima web development first project AI-Powered Applicant Tracking System (ATS)</h2> */}
      <ApplicantDashboard />
      <AdminDashboard />
    </>

  )
}

export default App



//import RecruiterDashboard from './components/Adim/recruiterdashboard';

//function App() {
 // return (
    //<div>
    //  <RecruiterDashboard />
   // </div>
  //);
//}

//export default App;


