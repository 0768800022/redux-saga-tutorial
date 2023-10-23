import { AppConstants, apiUrl, apiTenantUrl, baseHeader, multipartFormHeader } from '.';

const apiConfig = {
    account: {
        login: {
            baseURL: `${apiUrl}v1/account/login`,
            method: 'POST',
            headers: baseHeader,
        },
        loginBasic: {
            baseURL: `${apiUrl}api/token`,
            method: 'POST',
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/account/update_profile_admin`,
            method: 'PUT',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
        },
        refreshToken: {
            baseURL: `${apiUrl}v1/account/refresh_token`,
            method: 'POST',
            headers: baseHeader,
        },
        logout: {
            baseURL: `${apiUrl}v1/account/logout`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    user: {
        getList: {
            baseURL: `${apiUrl}v1/account/list`,
            method: `GET`,
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/account/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/account/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/account/create_admin`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/account/update_admin`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
    },
    file: {
        upload: {
            path: `${AppConstants.mediaRootUrl}v1/file/upload`,
            method: 'POST',
            headers: multipartFormHeader,
            isRequiredTenantId: true,
            isUpload: true,
        },
    },
    category: {
        getList: {
            baseURL: `${apiTenantUrl}v1/category/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/category/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/category/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/category/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/category/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/category/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    subject: {
        getList: {
            baseURL: `${apiTenantUrl}v1/subject/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/subject/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/subject/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/subject/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/subject/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/subject/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    projectRole: {
        getList: {
            baseURL: `${apiTenantUrl}v1/project-role/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/project-role/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/project-role/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/project-role/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/project-role/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/project-role/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    course: {
        getList: {
            baseURL: `${apiTenantUrl}v1/course/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListLeaderCourse: {
            baseURL: `${apiTenantUrl}v1/course/leader-course`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListStudentCourse: {
            baseURL: `${apiTenantUrl}v1/course/student-course`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/course/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/course/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/course/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/course/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/course/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },      
        updateLeaderCourse: {
            baseURL: `${apiTenantUrl}v1/course/update-leader`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    registration: {
        getList: {
            baseURL: `${apiTenantUrl}v1/registration/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/registration/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/registration/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/registration/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/registration/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        acceptRequest: {
            baseURL: `${apiTenantUrl}v1/registration/accept-request`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    registrationMoney: {
        getList: {
            baseURL: `${apiTenantUrl}v1/registration-money-history/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/registration-money-history/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/registration-money-history/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/registration-money-history/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/registration-money-history/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    organize: {
        getList: {
            baseURL: `${apiUrl}v1/career/list`,
            method: `GET`,
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}v1/career/get/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        getDetail: {
            baseURL: `${apiUrl}v1/career/detail/:id`,
            method: `GET`,
            headers: baseHeader,
        },
        create: {
            baseURL: `${apiUrl}v1/career/create`,
            method: `POST`,
            headers: baseHeader,
        },
        update: {
            baseURL: `${apiUrl}v1/career/update`,
            method: `PUT`,
            headers: baseHeader,
        },
        delete: {
            baseURL: `${apiUrl}v1/career/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
        },
        getProfile: {
            baseURL: `${apiUrl}v1/career/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}v1/career/update_profile`,
            method: 'PUT',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}v1/career/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
    },
    student: {
        getList: {
            baseURL: `${apiTenantUrl}v1/student/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/student/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/student/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/student/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/student/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/student/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getAllCourse: {
            baseURL: `${apiTenantUrl}v1/student/my-course/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        login: {
            baseURL: `${apiTenantUrl}v1/student/login-student`,
            method: 'POST',
            headers: baseHeader,
            isLogin: true,
            isRequiredTenantId: true,
        },
        getProfile: {
            baseURL: `${apiTenantUrl}v1/student/get-myprofile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiTenantUrl}v1/student/update-profile`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getDetailByPhone: {
            baseURL: `${apiTenantUrl}v1/student/detail-by-phone`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    leader: {
        getList: {
            baseURL: `${apiTenantUrl}v1/leader/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/leader/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/leader/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/leader/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        updateProfile: {
            baseURL: `${apiTenantUrl}v1/leader/update_profile`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/leader/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/leader/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getProfile: {
            baseURL: `${apiTenantUrl}v1/leader/profile`,
            method: 'GET',
            headers: baseHeader,
            // isRequiredTenantId: true,
        },
        login: {
            baseURL: `${apiTenantUrl}v1/leader/login`,
            method: 'POST',
            headers: baseHeader,
            isLogin: true,
            isRequiredTenantId: true,
        },
    },
    developer: {
        getList: {
            baseURL: `${apiTenantUrl}v1/developer/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/developer/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/developer/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/developer/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/developer/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/developer/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getProject: {
            baseURL: `${apiTenantUrl}v1/developer/project/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    lecture: {
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/lecture/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/lecture/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/lecture/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getBySubject: {
            baseURL: `${apiTenantUrl}v1/lecture/get-by-subject/:subjectId`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getList: {
            baseURL: `${apiTenantUrl}v1/lecture/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/lecture/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/lecture/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        updateSort: {
            baseURL: `${apiTenantUrl}v1/lecture/update-sort`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    task: {
        getList: {
            baseURL: `${apiTenantUrl}v1/task/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        asignALl: {
            baseURL: `${apiTenantUrl}v1/task/asign-all`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/task/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/task/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/task/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getById: {
            baseURL: `${apiTenantUrl}v1/task/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/task/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        checkAsign: {
            baseURL: `${apiTenantUrl}v1/task/check-asign`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        courseTask: {
            baseURL: `${apiTenantUrl}v1/task/course-task/:courseId`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        studentTask: {
            baseURL: `${apiTenantUrl}v1/task/student-task`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        updateState: {
            baseURL: `${apiTenantUrl}v1/task/update-state`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    project: {
        getList: {
            baseURL: `${apiTenantUrl}v1/project/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListLeader: {
            baseURL: `${apiTenantUrl}v1/project/leader-project`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListStudent: {
            baseURL: `${apiTenantUrl}v1/project/student-project`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/project/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/project/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/project/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getById: {
            baseURL: `${apiTenantUrl}v1/project/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        
        update: {
            baseURL: `${apiTenantUrl}v1/project/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        updateLeaderProject: {
            baseURL: `${apiTenantUrl}v1/project/update-leader`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    projectTask: {
        getList: {
            baseURL: `${apiTenantUrl}v1/project-task/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/project-task/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/project-task/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/project-task/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        getById: {
            baseURL: `${apiTenantUrl}v1/project-task/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/project-task/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        changeState: {
            baseURL: `${apiTenantUrl}v1/project-task/change-state`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    memberProject: {
        getList: {
            baseURL: `${apiTenantUrl}v1/member-project/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/member-project/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/member-project/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/member-project/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/member-project/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/member-project/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    company: {
        getList: {
            baseURL: `${apiTenantUrl}v1/company/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/company/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/company/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/company/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/company/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/company/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getProfile: {
            baseURL: `${apiTenantUrl}v1/company/profile`,
            method: 'GET',
            headers: baseHeader,
            // isRequiredTenantId: true,
        },
        login: {
            baseURL: `${apiTenantUrl}v1/company/login`,
            method: 'POST',
            headers: baseHeader,
            isLogin: true,
            isRequiredTenantId: true,
        },
        updateProfile: {
            baseURL: `${apiTenantUrl}v1/company/update-profile`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    companySubscription: {
        getList: {
            baseURL: `${apiTenantUrl}v1/company-subscription/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/company-subscription/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/company-subscription/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/company-subscription/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/company-subscription/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/company-subscription/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },

        buyService: {
            baseURL: `${apiTenantUrl}v1/company-subscription/buy-service`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    serviceCompanySubscription: {
        getList: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListServiceActive: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/list-service-active`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getMyService: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/my-service`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/service-company-subscription/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    settings: {
        getList: {
            baseURL: `${apiTenantUrl}v1/setting/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/setting/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/setting/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/setting/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/setting/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/setting/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    team: {
        getList: {
            baseURL: `${apiTenantUrl}v1/team/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/team/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/team/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/team/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/team/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/team/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    courseRequest: {
        getList: {
            baseURL: `${apiTenantUrl}v1/course-request/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/course-request/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/course-request/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/course-request/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/course-request/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/course-request/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    companyRequest: {
        getList: {
            baseURL: `${apiTenantUrl}v1/company-request/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/company-request/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/company-request/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/company-request/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/company-request/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/company-request/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    taskLog: {
        getList: {
            baseURL: `${apiTenantUrl}v1/task-log/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/task-log/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/task-log/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/task-log/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/task-log/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/task-log/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    projectTaskLog: {
        getList: {
            baseURL: `${apiTenantUrl}v1/project-task-log/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/project-task-log/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/project-task-log/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/project-task-log/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/project-task-log/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/project-task-log/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    companySeek: {
        getList: {
            baseURL: `${apiTenantUrl}v1/company-seek/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getListDev: {
            baseURL: `${apiTenantUrl}v1/company-seek/list-dev`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/company-seek/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getByIdDev: {
            baseURL: `${apiTenantUrl}v1/company-seek/detail-developer/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/company-seek/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/company-seek/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/company-seek/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    review: {
        getList: {
            baseURL: `${apiTenantUrl}v1/review/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiTenantUrl}v1/review/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        listReviews: {
            baseURL: `${apiTenantUrl}v1/review/list-reviews/:courseId`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        myReview: {
            baseURL: `${apiTenantUrl}v1/review/my-review/:courseId`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiTenantUrl}v1/review/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiTenantUrl}v1/review/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiTenantUrl}v1/review/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiTenantUrl}v1/review/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        star: {
            baseURL: `${apiTenantUrl}v1/review/star/:courseId`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
};
export default apiConfig;
