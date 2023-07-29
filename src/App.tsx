import { useState } from 'react';
import './App.css';
import Menu from './components/Menu';
import DatabaseContextProvider from './components/DatabaseContextProvider';
import SousMenu from './components/SousMenu';

function App() {
  const [menu, setMenu] = useState(0);

  return (
    <DatabaseContextProvider>
      <div className="App">
        <Menu value={menu} setter={setMenu}/>
        <SousMenu id={menu}/>
      </div>
    </DatabaseContextProvider>
  );
}

export default App;