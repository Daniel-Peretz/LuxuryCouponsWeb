import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ClientType } from "../../../../../Models/ClientTypeModel";
import Company from "../../../../../Models/CompanyModel";
import { logoutAuthAction } from "../../../../../Redux/AuthState";
import { GetCompanyCouponsAction, GetCompanyDetailsAction } from "../../../../../Redux/CompanyState";
import { myStore } from "../../../../../Redux/Store";
import decodeGetType from "../../../../../Services/decodeUserType/decodeGetType";
import JwtAxios from "../../../../../Services/JwtAxios/JwtAxios";
import notify from "../../../../../Services/Notify/Notify";

function GetCompanyDetails(): JSX.Element {
    
    const [myCompany, setMyCompany] = useState<Company>();
    const history = useHistory();
    
    const fetchCompany = async () => {
        try {
            couponsIfNull();
            if (decodeGetType() === ClientType.COMPANY) {
                const { data: myCompany }: { data: Company } = await JwtAxios.get("/COMPANY/companyDetails");
                myStore().store.dispatch(GetCompanyDetailsAction(myCompany));
                setMyCompany(myCompany);
            }
        } catch (err) {
            console.log(err.resp)
            if(!(err.response === undefined)){
            if(err.response.status === 500){
              myStore().store.dispatch(logoutAuthAction())
            }
            notify.error(err.response.data);
            } else{
              notify.error("Oops something went wrong")
            }
            history.push("/home")
        }
    }
    
    const couponsIfNull = async () => {
        try{
            if (myStore().store.getState().companyState.Coupons.length === 0){
                const { data: coupons } = await JwtAxios.get("/COMPANY/getCompanyCoupons");
                myStore().store.dispatch(GetCompanyCouponsAction(coupons));
        }} catch (err){
            if(err.response.status === 500){
                myStore().store.dispatch(logoutAuthAction())
            }
            notify.error(err.response.data);
        }
    }
    
    useEffect(() => {
        fetchCompany();
    },[]);

    return (
        <div className="GetCompanyDetails Box">
            <h3>Account Details</h3>
            <Form.Label>Company Name: </Form.Label>
            {myStore().store.getState().companyState.company.name}<br />
            <Form.Label>Email: </Form.Label>
            {myStore().store.getState().companyState.company.email}<br />
            <Form.Label>Password: </Form.Label>
            {myStore().store.getState().companyState.company.password}<br />
            <Form.Label>Coupons: </Form.Label>
            {myStore().store.getState().companyState.Coupons.length}
            <br />
        </div>
    );
}

export default GetCompanyDetails;
