//const { response } = require("express");

const url ="http://localhost:3000/api/get/class?univ=0";


let userList = document.querySelector(".tbody");


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
    AddList(res);
    console.log(response.length);
  })
  .catch((error) => console.log("error:", error));
}
lookUpList();

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
    }
  }


