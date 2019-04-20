import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';

// Register User
export const registerUser = (userData, history) => dispatch => {

    axios.post('/api/users/register', userData)
        .then(res => history.push('./login'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
    
};

export const loginUser = userData => dispatch => {
    axios.post('/api/users/login', userData)
        .then(res => {
            // Save to localStorage
            const { token } = res.data;
            // Set Token to localStorage
            localStorage.setItem('jwtToken', token);
            // Set to Auth header
            setAuthToken(token);
            //Decode Token to get UserData
            const decoded = jwt_decode(token);
            // Set Current User
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
}


// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}


// Log out User
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header
    setAuthToken(false);
    // Set current user to {} wich will set isAutenticate to false
    dispatch(setCurrentUser({}));
}