import { Link, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBell, faGaugeHigh, faFingerprint, faCartShopping, faUserPlus, faUserXmark, faUsers, faUser, faUserTie, faListCheck, faTableCellsLarge, faCommentDots, faCartPlus, faBarsProgress, faHollyBerry, faCoins, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { faClock, faMoneyBill1, faCreditCard } from '@fortawesome/free-regular-svg-icons'
import '../App.css'
import logo from '../images/logo.jpg'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";




function Layout() {
    const [open, setopen] = useState(false);
    const navigate = useNavigate();
    const login = sessionStorage.getItem("isLogged");
    const [notifications, setNotifications] = useState([]);
    async function getNotification() {
        try {
            const response = await fetch(`http://localhost:3000/getNotification?person=${"Admin"}`);
            const data = await response.json();
            setNotifications(data.result);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getNotification();
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById('mySidebar');
            const main = document.getElementById('main');

            if (sidebar && !sidebar.contains(event.target) && main.contains(event.target)) {
                closeNav();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };


    }, [new Date()]);

    useEffect(() => {
        if (!login) {
            navigate('/');
        }
    }, [login, navigate]);
    function logout() {
        sessionStorage.clear();
        navigate('/', { replace: true });
    }
    function openNav() {
        document.getElementById("mySidebar").style.width = "300px";
        document.getElementById("main").style.marginLeft = "300px";
        setopen(true);
    }
    function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        setopen(false);
    }

    return login ? (
        <>
            <div id="mySidebar" className="sidebar">
                <img src={logo} alt="" />
                <Link to="/AdminLayout"><p className='d-flex mt-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faGaugeHigh} />DashBoard</p></Link><hr />
                <a href="#"><p className='d-flex' data-bs-toggle="collapse" data-bs-target="#projectManagement"><FontAwesomeIcon className='fs-5 me-1 ' icon={faListCheck} />Project Management</p></a><hr />
                <div id="projectManagement" className='collapse'>
                    <Link to="AdminProject" ><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faBarsProgress} />Projects</p></Link><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faBarsProgress} />Project Catogorizes</p></a><hr />
                    <Link to="assign" ><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faListCheck} />Assign Projects</p></Link><hr />
                </div>
                <a href="#"><p className='d-flex' data-bs-toggle="collapse" data-bs-target="#employeeManagment"><FontAwesomeIcon className='fs-5 me-1 ' icon={faUserTie} />Employee Management</p></a><hr />
                <div id="employeeManagment" className='collapse'>
                    <a href="#"><p className='d-flex ms-3'> <FontAwesomeIcon className='fs-5 me-1 ' icon={faFingerprint} />Mark Attendance</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faHollyBerry} />Configure Holidays</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faUserPlus} />Employ Withdraw</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faClock} rotation={270} />Attendances</p></a><hr />
                    <Link to="Adminleave" ><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faUserXmark} />Leave Request</p></Link><hr />
                </div>
                <a href="#"><p className='d-flex' data-bs-toggle="collapse" data-bs-target="#userManagement"><FontAwesomeIcon className='fs-5 me-1 ' icon={faUser} />User Management</p></a><hr />
                <div className="collapse" id="userManagement">
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faUserPlus} />Users</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faUsers} />Customers</p></a><hr />
                </div>
                <a href="#"><p className='d-flex' data-bs-toggle="collapse" data-bs-target="#taskManagment"><FontAwesomeIcon className='fs-5 me-1 ' icon={faListCheck} />Task Management</p></a><hr />
                <div className="collapse" id='taskManagment'>
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faTableCellsLarge} />Todo's</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faListCheck} />Quotation</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faTableCellsLarge} />Progress</p></a><hr />
                </div>
                <a href="#"><p className='d-flex' data-bs-toggle="collapse" data-bs-target="#sales"><FontAwesomeIcon className='fs-5 me-1 ' icon={faCartShopping} />Sales and Transaction</p></a><hr />
                <div className="collapse" id='sales'>
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faCartPlus} />Sales</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faCreditCard} />Payment</p></a><hr />
                </div>
                <a href="#"><p className='d-flex'><FontAwesomeIcon className='fs-5 me-1 ' icon={faCommentDots} />Conversations</p></a><hr />
                <a href="#"><p className='d-flex' data-bs-toggle="collapse" data-bs-target="#finance"><FontAwesomeIcon className='fs-5 me-1 ' icon={faCoins} />Financial Management</p></a><hr />
                <div className="collapse" id='finance'>
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faMoneyBill1} />Expense</p></a><hr />
                    <a href="#"><p className='d-flex ms-3'><FontAwesomeIcon className='fs-5 me-1 ' icon={faBarsProgress} />Expense Category</p></a><hr />
                </div>
                <a href="#" role='button' onClick={logout}><p className='d-flex'><FontAwesomeIcon className='fs-5 me-1 fa-rotate-180' icon={faArrowRightFromBracket} />Logout</p></a><hr />
            </div>

            <div id="main">
                <div className="container-fluid p-0">
                    <div className="d-flex justify-content-between  " style={{ backgroundColor: "white" }}>
                        {!open ? (<button className="openbtn btn" onClick={openNav}>☰</button>) : (<button className="openbtn btn" onClick={closeNav}>☰</button>)}
                        <img src={logo} alt="" />
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <div className="container-fluid">
                                <button className="btn border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon className='fs-5  mt-1' icon={faBell} />
                                    {notifications.length > 0 && (
                                        <span className="badge bg-danger text-light rounded-pill" style={{ fontSize: "60%" }}>{notifications.length}</span>
                                    )}
                                </button>
                                <div className="dropdown-menu dropdown-menu-end p-3 shadow-sm me-4 mt-0" style={{ width: '400px', maxHeight: '500px', overflowY: 'auto' }}>
                                    <h5 className="fw-bold text-secondary">Notifications</h5><hr />
                                    <ul className="list-unstyled">
                                        {notifications.length > 0 ? (notifications.slice(0,5).map((notification) => (
                                            <li key={notification._id} className="d-flex  mb-2 list-group-item notification_button">
                                                <div>
                                                    <button className='btn m-0 p-0 border-0 d-flex justify-content-between my-3' onClick={() => { navigate("Adminleave") }}>
                                                        <p className="mb-1">{notification.EmpName} has sent a Leave Request</p>
                                                        <small className={`text-muted ${notification.Date==="less than a minute ago"? "ms-3": "ms-5" }`}>{notification.Date}</small>
                                                    </button>
                                                    
                                                </div>
                                                <hr />
                                            </li>
                                        ))) : (
                                            <div className='text-muted d-flex justify-content-center'>
                                                No New Notifications
                                            </div>
                                        )}
                                    </ul>

                                </div>
                            </div>
                        </nav>
                    </div>
                    <Outlet />
                </div>
            </div>

        </>
    ) : null;
}

export default Layout;
