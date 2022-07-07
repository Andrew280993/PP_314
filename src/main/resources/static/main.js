$(async function () {
    getTableWithUsers()
    getActiveUserInfo()
    addNewUserForm()
    addNewUser()
    getDefaultModal()
})

    const userFetchService = {
        head: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Referer': null,
        },

        showAllUsers: async () => await fetch('api'),
        thisUser: async () => await fetch('api/principal'),
        addNewUser: async (user) => await fetch('api', {
            method: 'POST',
            headers: userFetchService.head,
            body: JSON.stringify(user)

        }),
        findUser: async (id) => await fetch(`api/${id}`),
        deleteUser: async (id) => await fetch(`api/${id}`, {
            method: 'DELETE',
            headers: userFetchService.head
        }),
        updateUser: async (user) => await fetch('api', {
            method: 'PUT',
            headers: userFetchService.head,
            body: JSON.stringify(user)
        })
}
async function getActiveUserInfo() {
    let headInfo = $('#headInfo')


    let principal = await userFetchService.thisUser();
    let user = principal.json();
    user.then(user => {
        let userInfoFilling = `
       <h5> <a> ${user.email}</a> with roles: ${user.roles.map(role => role.role)}</h5>
    `
        headInfo.append(userInfoFilling)
    })
}
// All users table
async function getTableWithUsers() {
    let userList = $('#getTableWithUsers');
    userList.empty();

    await userFetchService.showAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let result = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.role)}</td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info"
                        data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                    </td>
                    <td>
                        <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger"
                        data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                    </td>
                </tr>
            )`;
                userList.append(result);
            })
        })

    $("#getTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show')
    })
}


// Array with all roles in database
const roleJson = []

fetch('api/roles')
    .then(res => res.json())
    .then(roles => roles.forEach(role => roleJson.push(role)))

// Event on Click Save New User

async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#addUserForm')
        let username = addUserForm.find('#usernameNewUser').val().trim();
        let lastName = addUserForm.find('#lastNameNewUser').val().trim();
        let age = addUserForm.find('#ageNewUser').val().trim();
        let email = addUserForm.find('#emailNewUser').val().trim();
        let password = addUserForm.find('#passwordNewUser').val().trim();
        let rolesArray = addUserForm.find('#newRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) if (r.id == rolesArray[i]) {
                roles.push(r)
            }
        }

        let data = {
            username: username,
            lastName: lastName,
            age : age,
            email: email,
            password: password,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data)
        if (response.ok) {
            getTableWithUsers()
    }
    })
}
// Add New User Form
async function addNewUserForm() {
    let form = $(`#addUserForm`)

    fetch('/api/roles').then(function (response) {
        form.find('#newRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                form.find('#newRoles')
                    .append($('<option>').val(role.id).text(role.role));
            })
        })
    })
}

async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {

        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

// Delete user form
async function deleteUser(modal, id) {
    let mainUser = await userFetchService.findUser(id)
    let user = mainUser.json()
    let modalForm = $(`#someDefaultModal`)
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let deleteButton = `<button class="btn btn-danger" id="deleteButton" data-dismiss="modal" data-backdrop="false">Delete</button>`

    modal.find('.modal-title').html('Delete user')
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(deleteButton)


    user.then(user => {
        let bodyForm = `<form id="deleteUser">
                            <div class="col-md-8 offset-md-2 text-center">
                                <div class="form-group">
                                    <label class="font-weight-bold">ID</label>
                                    <input type="text" value="${user.id}" name="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">First name</label>
                                    <input type="text" value="${user.username}" name="username" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Last name</label>
                                    <input type="text" value="${user.lastName}" name="lastName" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                     <label class="font-weight-bold">Age:</label>
                                     <input type="number" value="${user.age}" name="age" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Email</label>
                                    <input type="email" value="${user.email}" name="email" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Role</label>
                                    <select multiple class="form-control" id="deleteRoles" size="2" readonly>`

        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/roles').then(function (response) {
        modalForm.find('#deleteRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#deleteRoles')
                    .append($('<option>').val(role.id).text(role.role));
            })
        })
    })

    $(`#deleteButton`).on('click', async () => {
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
            await getTableWithUsers()
            modal.modal('hide');
        }
    })
}

// Edit user form
async function editUser(modal, id) {
    let mainUser = await userFetchService.findUser(id)
    let user = mainUser.json()
    let modalForm = $(`#someDefaultModal`)

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let editButton = `<button class="btn btn-primary" id="editButton" data-dismiss="modal" data-backdrop="false">Edit</button>`

    modal.find('.modal-title').html('Edit user')
    modal.find('.modal-footer').append(closeButton)
    modal.find('.modal-footer').append(editButton)

    user.then(user => {
        let bodyForm = `<form id="editUser">
                            <div class="col-md-8 offset-md-2 text-center">
                                <div class="form-group">
                                    <label class="font-weight-bold">ID</label>
                                    <input type="text" value="${user.id}" name="id" id="id" class="form-control" readonly>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">First name</label>
                                    <input type="text" value="${user.username}" name="username" id="username" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Last name</label>
                                    <input type="text" value="${user.lastName}" name="lastName" id="lastName" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label for="age" class="col-form-label"><b>Age:</b></label>
                                    <input type="number" value="${user.age}" class="form-control" id="age" name="age">
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Email</label>
                                    <input type="text" value="${user.email}" name="email" id="email" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Password</label>
                                    <input type="password" value="${user.password}" name="password" id="password" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Role</label>
                                    <select multiple class="custom-select" id="updateRoles" size="2">`
        modal.find('.modal-body').append(bodyForm)
    })

    fetch('/api/roles').then(function (response) {
        modalForm.find('#updateRoles').empty();
        response.json().then(roleList => {
            roleList.forEach(role => {
                modalForm.find('#updateRoles')
                    .append($('<option>').val(role.id).text(role.role));
            })
        })
    })

    $("#editButton").on('click', async () => {
        let id = modal.find('#id').val()
        let username = modal.find('#username').val()
        let lastName = modal.find('#lastName').val()
        let age = modal.find('#age').val()
        let email = modal.find('#email').val()
        let password = modal.find('#password').val()
        let rolesArray = modal.find('#updateRoles').val()
        let roles = []

        for (let r of roleJson) {
            for (let i = 0; i < rolesArray.length; i++) {
                if (r.id == rolesArray[i]) {
                    roles.push(r)
                }
            }
        }

        let data = {
                id: id,
                username: username,
                lastName: lastName,
                age : age,
                email: email,
                password: password,
                roles: roles
        }

        const response = await userFetchService.updateUser(data)
        if (response.ok) {
            await getTableWithUsers()
            modal.modal('hide')
        }
    })
}