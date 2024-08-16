import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function login() {
    const toastMixin = Swal.mixin({
        toast: true,
        icon: 'warning',
        title: 'General Title',
        animation: false,
        position: 'top-right',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    const [formData,setformData]=useState({
        Email:'',
        Password :''
    })
    
    const navigate=useNavigate();
    async function Login(event)
    {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data=await response.json();
            if(response.ok)
            {
                sessionStorage.setItem("isLogged",true);
                sessionStorage.setItem("id",data.existing[0]._id);
                console.log(data.existing[0]._id)
                if(data.existing[0].Status==="Member")
                    navigate("/Layout")
                else
                navigate("/AdminLayout")
            }
            else{
                toastMixin.fire({
                    animation: true,
                    title: 'InValid Credentials'
                });
            }
        }catch(err){}
    }
    function handleChange(event)
    {
        const name=event.target.name;
        const value=event.target.value;
        setformData((prev)=>{
            return{
                ...prev,
                [name]: value,
            }
        })
    }
    return (
        <>
            <div className="container-fluid full-height d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: "#f1f1f1" }}>
                <div className="row w-100">
                    <div className="col-md-4 mx-auto">
                        <form className="needs-validation" onSubmit={Login}>
                            <div className="card container bg-body rounded shadow-lg " style={{height:"50vh"}}>
                                <div className="card-heading d-flex justify-content-center ">
                                    <h2 className="mt-3">Login</h2>
                                </div>
                                <div className="card-body">
                                    
                                    <div className="form-floating mb-3 shadow-sm rounded" >
                                        <input type="email" className="form-control " id="floatingInput" placeholder="name@example.com" required name="Email" value={formData.Email} onChange={handleChange} />
                                        <label htmlFor="floatingInput">Email address</label>
                                        
                                    </div>
                                    <div className="form-floating mb-3 shadow-sm rounded">
                                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" required name="Password" value={formData.Password} onChange={handleChange} />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    <div className="row">
                                    <button type="submit" className="btn btn-primary col-md-11 ms-3 shadow-sm rounded">Login</button></div>
                                </div>
                                <div className="no-account d-flex justify-content-center">
                                    <p>Don't have An Account <a href="/Signup">Sign Here</a></p>
                                </div>
                                    
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}
export default login;