import { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";


export default function PilotFunctions({ setFeedback }) {
    const { userContextData, setUserContextData } = useContext(UserContext)
    const [flight, setFlight] = useState()


    useEffect(() => {
        const config = {
            headers: { Authorization: `Bearer ${userContextData.accessToken}` }
        }

        async function callAPI() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_AUTHORITY_URL}${process.env.REACT_APP_PILOT_CURRENT_ACTIVE_FLIGHT_URL}${userContextData.id}`, config)

                setFlight(response.data)
            } catch (error) {
                if (error.response) {
                    console.log('Data: ' + error.response.data);
                    console.log('Status: ' + error.response.status);
                    console.log('Headers: ' + error.response.headers);
                    if (error.response.data.message) {
                        setFeedback(error.response.data.message);
                    }
                }
            }
        }
        callAPI()
    }, [])


    function handleCloseFlight() {
        const config = {
            headers: { Authorization: `Bearer ${userContextData.accessToken}` }
        }

        async function callApi() {
            try {
                const response = await axios.post(`${process.env.REACT_APP_AUTHORITY_URL}${process.env.REACT_APP_PILOT_CLOSE_FLIGHT_URL}${userContextData.id}`, { "id": flight.id }, config)
                setFlight(response.data)
            } catch (error) {
                if (error.response) {
                    console.log('Data: ' + error.response.data);
                    console.log('Status: ' + error.response.status);
                    console.log('Headers: ' + error.response.headers);
                    if (error.response.data.message) {
                        setFeedback(error.response.data.message);
                    }
                }
            }
        }
        callApi()
    }



    return (
        <table className="pilot-flight-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Duration</th>
                    <th>Aircraft</th>
                    <th>Seats</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {flight?.id && <tr>
                    <td>{flight.name}</td>
                    <td>{flight.tour.location}</td>
                    <td>{flight.tour.duration} hours</td>
                    <td>{flight.aircraft.type}</td>
                    <td>{flight.users.map((user) => (
                        <p key={user.id}>{user.firstname} {user.lastname}</p>
                    ))}</td>
                    <td> <button type="button" onClick={handleCloseFlight}>Close</button></td>
                </tr>}
            </tbody>
        </table>


    )
}