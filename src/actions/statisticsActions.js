
import { queryStatData } from "../api/graphQL"
import {
  FETCH_STAT_DATA_PASS,
  FETCH_STAT_DATA_FAIL,
  FETCH_STAT_DATA_START
} from "../types";

function isNew(req, sem ){
  let isnew = true
  req.map( r => {
    if (sem > r.forSemester ){
      isnew =  false }
    return r
  } )
  return isnew
}

function isLong(req, sem ){
  let islong = false
  req.map( r => {
    if (sem !== r.forSemester ){
      islong =  true }
    return r
  } )
  return islong
}
function thisRequestedTime(req, sem ){
  let islong = 0
  req.map( r => {
    if (sem === r.forSemester ){
      islong =  r.time }
    return r
  } )
  return islong
}

export const convertData = (statData, semester) => {
  const proposals = statData.proposals.map( proposal =>   (
    {
      proposalId: proposal.id,
      title: proposal.title,
      abstract: proposal.abstract,
      proposalCode: proposal.code,
      semester: proposal.semester,
      isP4: proposal.generalInfo.isP4,
      status: proposal.generalInfo.status,
      maxSeeing: proposal.generalInfo.maxSeeing,
      transparency: proposal.generalInfo.transparency,
      isNew: isNew(proposal.timeRequests, semester),
      isLong: isLong(proposal.timeRequests, semester),
      thisRequestedTime: thisRequestedTime(proposal.timeRequests, semester),
      minTime: proposal.minimumUsefulTime,
      instruments: proposal.instruments,
      pi: `${ proposal.pi.surname } ${ proposal.pi.name }`
    } )
);

  const targets = statData.targets
  return {
    proposals,
    targets
  }
};

function startFetchData() {
  return (
    {
       type: FETCH_STAT_DATA_START
  }
);

}
function FetchDataFail() {
  return (
    {
       type: FETCH_STAT_DATA_FAIL
  }
);
}

function FetchDataPass(load) {
  return (
    {
       type: FETCH_STAT_DATA_PASS,
       payload: load
  }
);
}

export function fetchStatData(semester, partner="All"){
  return function disp(dispatch){
    dispatch(startFetchData());
    queryStatData(semester, partner).then( res =>
      {
        dispatch(FetchDataPass(convertData(res.data.data, semester)))}
    ).catch((err) => {
      console.log(err);
      dispatch(FetchDataFail())})
  }
}
