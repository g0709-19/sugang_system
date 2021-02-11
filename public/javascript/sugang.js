//const { response } = require("express");

const url ="http://localhost:3000/api/get/class?univ=0";


let userList = document.querySelector(".tbody");
//모든 유저의 수강 과목들의 취소버튼
let cancelBtnArr = document.querySelectorAll(".cancelsubjectBtn");
//조회버튼
let searchDataBtn = document.querySelector('#searchData');
//대학인풋박스
let univInput = document.querySelector('#univInput');
//학과인풋박스
let departmentInput = document.querySelector('#departmentInput');

lookUpList();
//대학 선택했을때 이벤트
univInput.addEventListener('input',createDepartmentInput);

// 조회 버튼 이벤트
searchDataBtn.addEventListener('click', handleSearchData);

//대학인풋박스 입력했을때 실행되는 함수
function createDepartmentInput(event)
{
  fetch(`http://localhost:3000/api/get/class?Major=${event.target.value}`)
  .then((response)=>{
    return response.json(response);
  })
  .then((json)=>{
    
    while(departmentInput.hasChildNodes())
    departmentInput.removeChild(departmentInput.firstChild);
    
    let option;
    for(let i=0;i<json.length;i++)
    {
      option=document.createElement('option');
      option.value=json[i].id;
      option.innerText=`[학과]${json[i].name}(${json[i].id})`;
      departmentInput.appendChild(option);
    }
  })
}


//취소버튼에 이벤트 생성하기
function addBtnEvent(event){
    
  let class_id= event.target.parentNode.querySelector('.classId').innerText;
  let url_del =`http://localhost:3000/api/delist/${class_id}`;
  
  fetch(url_del)
  .then((response)=>{
      return response.json(response);
  })
  .then((json)=>{
    if(json.enrolled)
    {
      lookUpList();
    }
    else
    {
      alert('취소를 실패하였습니다.');
    }
  })
  .catch((error) => console.log("error:", error));
  console.log(class_id);
}

//수강신청한 목록들 보여주기
function lookUpList(){

  let res;
  const url2 ="http://localhost:3000/api/get/class?user=1";
  fetch(url2)//비동기
  .then((response) => {
    return response.json(response);
  })
  .then((response)=>{
    res = response;
    delList();
    AddList(res);
    //console.log(response.length);
  })
  .catch((error) => console.log("error:", error));
}

  function AddList(res){
      
    let td = [];
    for(let j=0;j<res.length;j++)
    {
      let tr = document.createElement('tr');
      tr.classList.add('subjectList');
      for(let i=0;i<10;i++)
      {
        td[i]=document.createElement('td');
      }
      //let aTag = document.createElement('a');
      td[0].innerText = res[j].grade;
      td[1].innerText = res[j].subject;
      td[2].innerText = res[j].name;
      td[3].innerText = res[j].id;
      td[3].classList.add('classId');
      td[4].innerText = res[j].time;
      td[5].innerText = res[j].credit;
      td[6].innerText = res[j].professor;
      td[7].innerText = res[j].date;
      td[8].innerText = res[j].room;
      //aTag.innerText = "취소";
      td[9].innerText="취소";
      td[9].classList.add('cancelsubjectBtn');
      
      for(let i=0;i<10;i++)
      {
        tr.append(td[i]);
      }
      userList.append(tr);
      td[9].addEventListener('click',addBtnEvent);
      
    }
    cancelBtnArr = document.querySelectorAll(".cancelsubjectBtn");
  }

  function delList(){
    let subjectList = document.querySelectorAll('.subjectList');

    for(let i=0;i<subjectList.length;i++)
    {
      while(subjectList[i].hasChildNodes())
      subjectList[i].removeChild(subjectList[i].firstChild);
      subjectList[i].parentNode.removeChild(subjectList[i]);
    }
    
  }


// 조회 버튼 클릭 시
function handleSearchData(event) {
  const univ = document.getElementById('univInput').value;
  const major = document.getElementById('departmentInput').value;
  console.log(`${univ} ${major}`);
  resetTable();
  showClasses(univ, major);
}

// 조회 목록 초기화
function resetTable() {
  const tbody = document.getElementById('calendarResult');
  const tr = document.createElement('tr');
  const temp = ['개설학년(반)','교과구분','교과목명','수강번호','시간','학점','교수명','시간 및 요일','강의실'];
  temp.forEach(t => {
    const td = document.createElement('td');
    td.innerText = t;
    tr.appendChild(td);
  });

  const parent = tbody.parentNode;
  parent.removeChild(tbody);
  const newbody = document.createElement('tbody');
  newbody.id = 'calendarResult';
  newbody.appendChild(tr);
  parent.appendChild(newbody);
}

// 조건에 맞게 목록 보여주기
function showClasses(univ, major) {
  // 대학만 왔을 경우(전공이 전체인 경우)
  // 대학이 전체인 경우
  // 전공이 있는 경우
  let url = undefined;
  if (major) {
    url = `http://localhost:3000/api/get/class?major=${major}`;
  } else if (univ) {
    url = `http://localhost:3000/api/get/class?univ=${univ}`;
  } else {
    url = `http://localhost:3000/api/get/class`;
  }

  const tbody = document.getElementById('calendarResult');
  fetch(url).then(res => res.json()).then(json => {
    json.forEach(row => addRow(tbody, row.grade, row.subject, row.name, row.id, row.time, row.credit, row.professor, row.date, row.room));
  });
}

// 한 행 생성
// tbody, 개설학년(반), 교과구분, 교과목명, 수강번호, 시간, 학점, 교수명, 시간 및 요일, 강의실
function addRow(tbody, grade, subject, name, id, time, credit, professor, date, room) {
  const tr = document.createElement('tr');
  tr.classList.add('subjectList');
  const temp = [grade, subject, name, id, time, credit, professor, date, room];
  
  for(let i=0;i<temp.length;i++)
  {
    const td = document.createElement('td');
    td.innerText = temp[i];
    if(i===3)
      td.classList.add('classId');
    tr.appendChild(td);
  }
  
  // temp.forEach(t => {
  //   const td = document.createElement('td');
  //   td.innerText = t;
  //   tr.appendChild(td);
    
  //});

  //신청버튼 추가
  const td = document.createElement('td');
  td.innerText = "신청";
  td.classList.add('enrollBtn');
  td.addEventListener('click',addCBtnEvent);
  tbody.appendChild(tr);
  tr.appendChild(td);
} 

//신청버튼에 이벤트 생성하기
function addCBtnEvent(event){
    
  let class_id= event.target.parentNode.querySelector('.classId').innerText;
  let url_del =`http://localhost:3000/api/enroll/${class_id}`;
  
  fetch(url_del)
  .then((response)=>{
      return response.json(response);
  })
  .then((json)=>{
    if(json.enrolled)
    {
      lookUpList();
    }
    else
    {
      alert('신청을 실패하였습니다.');
    }
  })
  .catch((error) => console.log("error:", error));
  console.log(class_id);
}