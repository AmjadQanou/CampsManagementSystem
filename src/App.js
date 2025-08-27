import './App.css';
import React, { useContext } from 'react'
import Dashborad from './Dashborad';
import  {BrowserRouter, createBrowserRouter, RouterProvider}  from 'react-router-dom';
import { Routes,Route } from 'react-router-dom';
import Table from './CRUDComponents/Table';
import Camps from './Lists/Camps';
import CampManagers from './Lists/CampManagers';
import ReliefRegister from './Lists/ReliefRegister';
import Items from './Lists/Items';
import AddItems from './CRUDComponents/item/AddItem';
import AddCamp from './CRUDComponents/Camps/AddCamps';
import DeleteCamp from './CRUDComponents/Camps/DeleteCamp';
import EditCamp from './CRUDComponents/Camps/EditCamp';
import AddDisCriteria from './CRUDComponents/DisCriterias.js/AddDisCriteria'
import DeleteDisCriteria from './CRUDComponents/DisCriterias.js/DeleteDisCriteria'
import EditDisCriteria from './CRUDComponents/DisCriterias.js/EditDisCriteria'
import Organization from './Lists/Organization';
import AddOrg from './CRUDComponents/Org/AddOrg';
import ReliefRequest from './Lists/ReliefRequest';
import AddReliefRequests from './CRUDComponents/ReliefReq/AddReliefRequests';
import EditReliefRequests from './CRUDComponents/ReliefReq/EditReliefRequests';
import DeleteReReq from './CRUDComponents/ReliefReq/DeleteReReq';
import Login from './DashboardComponents/login';
import DPs from './Lists/DPs'
import AddDPs from './CRUDComponents/DPs/AddDPs'
import EditDPs from './CRUDComponents/DPs/EditDPs'
import AddCampManager from './CRUDComponents/CampManagers/AddCampMan'
import DeleteCampManger from './CRUDComponents/CampManagers/DeleteCampMan'
import EditCampManager from './CRUDComponents/CampManagers/EditCampMan'
import AddHealthIs from './CRUDComponents/HealthIssues/AddHealthIs'
import DeleteHealthIs from './CRUDComponents/HealthIssues/DeleteHealthIs'
import EditHealthIs from './CRUDComponents/HealthIssues/EditHealthIs'
import DeleteItem from './CRUDComponents/item/DeleteItems'
import EditItem from './CRUDComponents/item/EditItems'
import DeleteOrg from './CRUDComponents/Org/DeleteOrg';
import EditOrg from './CRUDComponents/Org/EditOrg';
import DistributionCriterias from './Lists/DistributionCriterias'
import HealthIssues from './Lists/HealthIssues'
import { AuthContext, AuthProvider } from './AuthProvider';
import RequireAuth from './RequireAuth';
import DPsRegister from './DashboardComponents/DPsRegister';
import Register from './DashboardComponents/register';
import RegisterChoice from './DashboardComponents/RegisterChoice';
import Mycamp from './DashboardComponents/Mycamp';
import AddOrgManager from './CRUDComponents/OrganizationManager/AddOrgManager';
import DeleteOrgManger from './CRUDComponents/OrganizationManager/DeleteOrgManger';
import EditOrgManager from './CRUDComponents/OrganizationManager/EditOrgManager';
import Displacments from './Lists/Displacment';
import AddDisplacmemt from './CRUDComponents/Displacments/AddDisplacmemt';
import EditDisplacement from './CRUDComponents/Displacments/EditDisplacmemt';
import DeleteDisplament from './CRUDComponents/Displacments/DeleteDisplacment';
import ReliefTracking  from './Lists/ReliefTracking';
import AddReliefTracking from './CRUDComponents/ReliefTracking/AddReliefTracking';
import EditReliefTracking from './CRUDComponents/ReliefTracking/EditReliefTracking';
import DeleteReliefTracking from './CRUDComponents/ReliefTracking/DeleteReliefTracking';
import OrganizationManager from './Lists/OrganizationManager';
import AddReliefs from './CRUDComponents/ReliefRegister/AddReliefs';
import EditReliefRegister from './CRUDComponents/ReliefRegister/EditReliefRej';
import DeleteReliefRejister from './CRUDComponents/ReliefRegister/DeleteReliefRej';
import DistributionDocs from './DistributionDocs';
import MyOrg from './DashboardComponents/MyOrg';
import Announcments from './Lists/Announcments';
import AddAnnouncement from './CRUDComponents/Announcment/AddAnnouncement';
import EditAnnouncement from './CRUDComponents/Announcment/EditAnnouncment';
import DeleteAnnuoncment from './CRUDComponents/Announcment/DeleteAnnuoncment';
import DPProfile from './DashboardComponents/DpProfile';
import AdminDashboard from './DashboardComponents/AdminD';
import DeleteDPs from './CRUDComponents/DPs/DeleteDPs';
import Notification from './Lists/Notifications';
import AddNotification from './CRUDComponents/Notifications/AddNotification';
import DeleteNotification from './CRUDComponents/Notifications/DeleteNotification';
import EditNotification from './CRUDComponents/Notifications/EditNotifications';
import Layout from './PageComponents/Layout'
import Home from './PageComponents/Home'
import Campss from './PageComponents/Camps'
import Organizations from './PageComponents/HomeOrganizations'
import AboutUs from './PageComponents/AboutUs'
import Announcment from './PageComponents/Announcment'
import NotFound from './PageComponents/NotFound'
import CampDetails from './PageComponents/CampDetails'
import OrganizationDetails from './PageComponents/OrgDetails'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import DpsRelief from './Lists/DpsRelief';






function App() {

 const {user}=useContext(AuthContext)
  return (
    <BrowserRouter>
       <Routes>



           <Route  element={<Layout/>}> 
                   <Route path='/' element={<Home/>}/>
                   <Route path='camps' element={<Campss/>}/>
                   <Route path='organizations' element={<Organizations/>}/>
                   <Route path='aboutus' element={<AboutUs/>}/>
                   <Route path='announcment' element={<Announcment/>}/>
                   <Route path='*' element={<NotFound/>}/>
                   <Route path='camp/:id' element={<CampDetails/>}/>
                   <Route path='organization/:id' element={<OrganizationDetails/>}/>

                   <Route path='login' element={<Login/>}/>
                      <Route path='dpregister' element={<DPsRegister/>}/>
                       <Route path="register" element={<Register />} />
                      <Route path="dpregister" element={<DPsRegister />} />
                       <Route path="registerchoice" element={<RegisterChoice />} />
                    <Route path='dpprof' element={<DPProfile/>}/>



         <Route path="dashboard" element={
                <RequireAuth>
                  <Dashborad />
                </RequireAuth>
               }   >




    
 

               <Route path='mycamp' element={<Mycamp/>}/>

               <Route path='myorg' element={<MyOrg/>}/>
               <Route path='admindash' element={<AdminDashboard/>}/>



               
               <Route path='showfiles' element={<DistributionDocs/>}/>



            


            <Route path='dps'>
                <Route index element={<DPs/>}/>
                <Route path='add' element={<AddDPs/>}/>
                <Route path='update/:id' element={<EditDPs/>}/>
                <Route path='delete/:id' element={<DeleteDPs/>}/>


            </Route>

            
            <Route path='dpsRelief'>
                <Route index element={<DpsRelief/>}/>



            </Route>


            <Route path='Camps'>
            <Route index element={<Camps/>}/>
            <Route path='add' element={<AddCamp/>}/>
            <Route path='update/:id' element={<EditCamp/>}/>
            <Route path='delete/:id' element={<DeleteCamp/>}/>
            <Route path='show/:id' element={<Mycamp/>}/>

            </Route>
            <Route path='campManagers' >
            <Route index element={<CampManagers/>}/>
            <Route path='add' element={<AddCampManager/>}/>
            <Route path='update/:id' element={<EditCampManager/>}/>
            <Route path='delete/:id' element={<DeleteCampManger/>}/>
            </Route>
            <Route path='reliefreg' >    
                <Route index element={<ReliefRegister/>}/>
                <Route path='add' element={<AddReliefs/>}/>
                 <Route path='update/:id' element={<EditReliefRegister/>}/>
                  <Route path='delete/:id' element={<DeleteReliefRejister/>}/>
                               
            </Route>
            <Route path='reliefreq'>
              <Route index element={<ReliefRequest/>}/>
              <Route path='add' element={<AddReliefRequests/>}/>
              <Route path='update/:id' element={<EditReliefRequests/>}/>
              <Route path='delete/:id' element={<DeleteReReq/>}/>
            </Route>
            <Route path='items' >
                <Route index element={<Items/>}/>     
                <Route path='add' element={<AddItems/>}/>
                <Route path='update/:id' element={<EditItem/>}/>
                <Route path='delete/:id' element={<DeleteItem/>}/>
            </Route>
            <Route path='discriteria'>
               <Route index element={<DistributionCriterias/>}/>
              <Route path='add' element={<AddDisCriteria/>} />
              <Route path='update/:id' element={<EditDisCriteria/>}/>
               <Route path='delete/:id' element={<DeleteDisCriteria/>}/>
            </Route>
            <Route path='healthIssues'>
               <Route index element={<HealthIssues/>}/>
               <Route path='add' element={<AddHealthIs/>}/>
                <Route path='update/:id' element={<EditHealthIs/>}/>
                <Route path='delete/:id' element={<DeleteHealthIs/>}/>
            </Route>

            <Route path='org'>
               <Route index element={<Organization/>}/>
               <Route path='add' element={<AddOrg/>}/>
               <Route path='update/:id'element={<EditOrg/>} />
               <Route path='delete/:id' element={<DeleteOrg/>}/>
            </Route>
                        <Route path='orgManager'>
                           <Route index element={<OrganizationManager/>}/>
                           <Route path='add' element={<AddOrgManager/>}/>
                           <Route path='update/:id'element={<EditOrgManager/>} />
                           <Route path='delete/:id' element={<DeleteOrgManger/>}/>
                        </Route>
                        <Route path='displacments'>
                           <Route index element={<Displacments/>}/>
                            <Route path='add' element={<AddDisplacmemt/>}/>
                           <Route path='update/:id'element={<EditDisplacement/>} />
                           <Route path='delete/:id' element={<DeleteDisplament/>}/> 
                        </Route>
                        <Route path='reliefTracking'>
                           <Route index element={<ReliefTracking/>}/>
                           <Route path='add' element={<AddReliefTracking/>}/>
                           <Route path='update/:id'element={<EditReliefTracking/>} />
                           <Route path='delete/:id' element={<DeleteReliefTracking/>}/>  
                        </Route>

                        <Route path='announcments' >
          <Route index element={<Announcments/>}/>
          <Route path='add' element={<AddAnnouncement/>}/>
          <Route path='update/:id'element={<EditAnnouncement/>} />
          <Route path='delete/:id' element={<DeleteAnnuoncment/>}/>  
          </Route>

          <Route path='notifications' >
                        <Route index  element={<Notification/>}/>
                        <Route path='add' element={<AddNotification/>}/>
                        <Route path='update/:id' element={<EditNotification/>}/>
                        <Route path='delete/:id' element={<DeleteNotification/>}/>
          </Route>

          </Route>
                
           </Route>

         
        </Routes>
    </BrowserRouter>

  );
}

export default App;
