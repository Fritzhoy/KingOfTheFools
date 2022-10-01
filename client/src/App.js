import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import {dark} from './styles/Themes'
import Navigation from './components/Navigation';
import Home from './components/sections/Home';
import About from './components/sections/About';



function App() {
  return (
    <>
     <GlobalStyles/>
      <ThemeProvider theme={dark}>
      <Navigation/>
      <Home/>
      <About/>
      </ThemeProvider>
    </>
  );
}

export default App;
