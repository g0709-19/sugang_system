//const { response } = require("express");

const url ="http://localhost:3000/api/get/class?univ=0";


let userList = document.querySelector(".tbody");
//모든 유저의 수강 과목들의 취소버튼
let cancelBtnArr = document.querySelectorAll(".cancelsubjectBtn");
//조회버튼
let searchDataBtn = document.querySelector('#searchData');

lookUpList();

searchDataBtn.addEventListener('click',()=>{

})

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
      let aTag = document.createElement('a');
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
      aTag.innerText = "취소";
      td[9].append(aTag);
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
    }
    
  }