import React,{ useState}from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Layout from '../../components/Layout/Layout'
import Card from '../../components/UI/Card/Card'
import { sigin } from '../../reducers/authReducers'
import './LoginPage.css'

const LoginPage = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const auth = useSelector(state=>state.auth);
    const userLogin = (e) =>{
        e.preventDefault();
        if(email===''){
            alert('Email is required')
        }
        if(password===''){
            alert('Password is required')
        }
        dispatch(sigin({email,password}));
    }

if(auth.authenticated){
    return <Redirect to={'/'} />
}

return(
      <Layout>
          <div className='loginContainer'>
              <Card>
                  <form onSubmit={userLogin}>
                  <h3>Login</h3>
                      <input name='email' type='text' value={email} onChange={ (e)=>setEmail(e.target.value) }  placeholder="Email" />
                      <input name='password' type='password' value={password} onChange={ (e)=>setPassword(e.target.value) }  placeholder="Password" />
                      <div>
                          <button >
                              Login
                          </button>
                      </div>
                  </form>
              </Card>
          </div>
      </Layout>
   )
 }

export default LoginPage