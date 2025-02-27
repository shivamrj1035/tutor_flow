import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import {appStore} from './app/store'
import {Toaster} from 'sonner'
import Loader from './components/Loader'


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={appStore}>
            <Loader>
                <App/>
                <Toaster/>
            </Loader>
        </Provider>
    </StrictMode>,
)
