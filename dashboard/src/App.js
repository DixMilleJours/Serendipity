import './App.css';
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import Home from './Components/Index/Home';
import TravelDetails from './Components/Search/Others/TravelDetails';
import { useSelector } from "react-redux";
import { themeSettings } from './theme';
import { AuthProvider } from './AuthContext';

function App() {
  const preferredMode = useSelector((state) => state.mode);

  React.useEffect(() => {
    // Update the document title using the browser API
    document.title = "Serendipity";
  }, []);

  const theme = React.useMemo(() => createTheme(themeSettings(preferredMode)), [preferredMode]);

  theme.typography.h2 = {
    fontSize: '1.2rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2.4rem',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline >
          <AuthProvider>
            <Router>
              <Routes>
                {/* ProtectedRoutes: if the user is logged in (check his token), then deny his access and redirect to the home page */}
                {/* <Route element={<ProtectedRoutes />}> */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path='/home/travel' element= {<TravelDetails/>} />
                {/* </Route> */}
                <Route path="*" element={<Navigate to='/404' />} />
              </Routes>
            </Router>
          </AuthProvider>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
