import React from "react";
import { Link } from "react-router-dom"
import { connect } from "react-redux";
import Select from "react-select";
import * as actions from "../actions/auth";
import { partnerChange, semesterChange, pageChange } from "../actions/filtersActions";
import { fetchStatData } from "../actions/statisticsActions";
import  fetchProposals  from "../actions/proposalsActions";
import  fetchTargets  from "../actions/targetsActions";
import { storePartnerAllocations  } from "../actions/timeAllocationActions";
import { semesterFilter, getPartnerList } from "../util/filters";

class Navigation extends React.Component {

  componentDidMount() {
    const selected = this.props.filters

    this.props.dispatch(actions.fetchUserData())

    this.props.dispatch(fetchStatData(
      selected.selectedSemester,
      selected.selectedPartner
    ))
    this.props.dispatch(
      fetchTargets(
      selected.selectedSemester,
      selected.selectedPartner
    ))
    this.props.dispatch(
      fetchProposals(
      selected.selectedSemester,
      selected.selectedPartner
    ))

    this.props.dispatch(storePartnerAllocations(
      selected.selectedSemester,
      selected.selectedPartner
    ))
  }
  updateSemester(event){
    this.props.dispatch(
      fetchProposals( event.value, this.props.filters.selectedPartner))
    this.props.dispatch(
      fetchTargets(event.value, this.props.filters.selectedPartner))
    this.props.dispatch(storePartnerAllocations(event.value, this.props.filters.selectedPartner))
  }
  updatePartner(event){
    this.props.dispatch(
      fetchProposals( this.props.filters.selectedSemester , event.value))
    this.props.dispatch(
      fetchTargets(this.props.filters.selectedSemester , event.value))
    this.props.dispatch(storePartnerAllocations(this.props.filters.selectedSemester , event.value))
  }

  render() {
    const { filters, user, dispatch   } = this.props
    const { selectedPartner, selectedSemester } = filters
    const partnerList = getPartnerList(user.user.roles || [])

    const sems = semesterFilter()


    return(
      <div>
        <ul className="nav">
          <li onClick={() => dispatch(pageChange("HomePage"))} className={filters.currentPage === "HomePage" ? "active" : ""} ><Link to="/">Home</Link></li>
          <li onClick={() => dispatch(pageChange("TechPage"))} className={filters.currentPage === "TechPage" ? "active" : ""} ><Link to="/techreview">Tech Review</Link></li>
          <li onClick={() => dispatch(pageChange("StatisticsPage"))} className={filters.currentPage === "StatisticsPage" ? "active" : ""} ><Link to="/statistics">Statistics</Link></li>
          <li onClick={() => dispatch(pageChange("TACPage"))} className={filters.currentPage === "TACPage" ? "active" : ""} ><Link to="/timeallocation">Time Allocation</Link></li>
          <li onClick={() => dispatch(pageChange("DocumentatonPage"))} className={filters.currentPage === "DocumentatonPage" ? "active" : ""} ><Link to="/documentation">Documentation</Link></li>
          <li onClick={() => dispatch(pageChange("AdminPage"))}  className={filters.currentPage === "AdminPage" ? "active" : ""}><Link to="/admin">Admin</Link></li>
          <button className="logoutbtn"
          onClick={() => this.props.dispatch(actions.logout())}> Logout</button>
      </ul>
        <ul className="nav">
           <div>
           <h1><b>TIME ALLOCATION COMMIT</b></h1>
           </div>
        </ul>

        <div className="selector-div">
          <div className="left">
            <h2>Semesters</h2>
            <Select
                className ="selector"
                name="Semester"
                options={sems}
                value={selectedSemester}
                clearable={false}
                focusedOption={selectedSemester}
                onChange={(event) => {
                  this.updateSemester(event)
                  this.props.dispatch(semesterChange(event.value))
                }}
                />
            </div>
            <div className="left-2">
              <h2> Partners </h2>
              <Select
                  className ="selector"
                  name="Partner"
                  options={partnerList}
                  value={selectedPartner}
                  clearable={false}
                  onChange={(event) => {
                    this.updatePartner(event)
                    this.props.dispatch(partnerChange(event.value))
                  }}
                  />
          </div>
        </div>
      </div>
      );
    }
  }

export default connect(
  store => ({filters: store.filters, statistics:store.statistics, user:store.user }), null
)(Navigation);
