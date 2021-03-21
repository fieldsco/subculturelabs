import Application from './Application';
import { FirebaseDatabaseProvider } from '@react-firebase/database';
import firebase from 'firebase';
import config from './config';

function App() {
  return (
    <FirebaseDatabaseProvider firebase={firebase} {...config}>
      <div className="App">
        <Application />
      </div>
    </FirebaseDatabaseProvider>
  );
}

export default App;
