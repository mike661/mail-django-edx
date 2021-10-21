document.addEventListener('DOMContentLoaded', function () {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_mail;

  // By default, load the inbox
  load_mailbox('inbox');

  //document.querySelector('#compose-form').addEventListener('submit', send_mail); co jest kurwa niby nie tak z tym??? Do chuja pana

});

function compose_email() {
  console.log('wywolalem sie');
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  console.log(`Wywolalem load mailbox z argumenetem ${mailbox}`);

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  let list = document.createElement("list");
  list.setAttribute("id", "emails-list")
  document.querySelector('#emails-view').appendChild(list)

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      console.log(emails)
      console.log(emails[0])
      for (const email of emails) {
        let li = document.createElement("li");
        let div = document.createElement("div");
        div.style.border = "solid"
        //NEW FEATURE VIEWING THE MAIL
        if (!email.read) {
          div.style.background = "green";
        }
        div.addEventListener('click', () => view_mail(email.id))
        //------------
        div.innerHTML = `${email.sender} ${email.subject} ${email.timestamp}`;
        li.appendChild(div);
        document.querySelector('#emails-list').appendChild(li);
      }
    })

}

function send_mail() {

  console.log("jestem w funkcji send_mail");

  const recipients = document.querySelector('#compose-recipients');
  const subject = document.querySelector('#compose-subject');
  const body = document.querySelector('#compose-body');

  fetch('/emails',
    {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients.value,
        subject: subject.value,
        body: body.value
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
      alert(result);
    })

  load_mailbox('sent');
  return false;
}


function view_mail(id) {

  console.log("jestem w funkcji view_mail");

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';


  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
      document.querySelector('#email-view').innerHTML = `${result.sender}<br> ${result.subject} <br>${result.body} <br>${result.timestamp}`;
      
      if(!result.archived) {
        let button = document.createElement("button");
        button.addEventListener('click', () => archive_mail(result.id));
        button.innerHTML = "Archive";
        document.querySelector('#email-view').appendChild(button);
      } else {
        let button = document.createElement("button");
        button.addEventListener('click', () => unarchive_mail(result.id));
        button.innerHTML = "Unarchive";
        document.querySelector('#email-view').appendChild(button);
      }

    })

  //marking email as read
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })


}

function archive_mail(id) {

  console.log("jestem w funkcji archive_mail");

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';


  //marking email as archived
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  })
}

function unarchive_mail(id) {

  console.log("jestem w funkcji archive_mail");

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';


  //marking email as archived
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  })
}