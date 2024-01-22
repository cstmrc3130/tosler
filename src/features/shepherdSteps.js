export const shepherdSteps = 
[
    // INTRODUCTION
    {
        id: 'introduction',
        attachTo: { element: '#introduction', on: 'bottom' },
        // beforeShowPromise: function ()
        // {
        //     return new Promise(function (resolve)
        //     {
        //         setTimeout(function ()
        //         {
        //             window.scrollTo(0, 0);
        //             resolve();
        //         }, 500);
        //     });
        // },
        buttons: [
            {
                action()
                {
                    return this.next();
                },
                text: 'Next'
            }
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'Welcome to Tosler!',
        text: ['Tosler is a regular to-do app with realtime timelapse and non-disruptive ringtone.'],
        when: {
            show: () =>
            {
                // console.log('show step');
            },
            hide: () =>
            {
                // console.log('hide step');
            }
        }
    },

    // CREATE TODO BUTTON
    {
        id: 'create-new-todo',
        attachTo: { element: '#create-new-todo', on: 'bottom' },
        beforeShowPromise: function ()
        {
            // return new Promise(function (resolve)
            // {
            //     setTimeout(function ()
            //     {
            //         window.scrollTo(0, 0);
            //         resolve();
            //     }, 500);
            // });
        },
        buttons: [
            {
                action()
                {
                    return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
            },
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'CREATE A NEW TODO',
        text: ['Now let\'s create a new to-do. Click on this button.'],
        when: {
            show: () =>
            {
                // console.log('show step');
            },
            hide: () =>
            {
                // console.log('hide step');
            }
        }
    },

    // INTRODUCE CREATE EDIT MODAL
    {
        id: 'introduce-create-edit-modal',
        attachTo: { element: '#modal-ecra-content', on: 'right' },
        beforeShowPromise: function ()
        {
            return new Promise(function (resolve)
            {
                setTimeout(function ()
                {
                    window.scrollTo(0, 0);
                    resolve();
                }, 300);
            });
        },
        buttons: [
            {
                action()
                {
                    document.getElementById('modal-ecra') ? document.getElementById('modal-ecra').checked = false : document.getElementById('modal-ecra').checked = false
                    return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
            },
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'CREATE A NEW TODO',
        text: ['Try to fill the form and press submit.'],
        when: {
            show: () =>
            {
                document.getElementById('modal-ecra') ? document.querySelector("#modal-ecra-content label").classList.add('btn-disabled') : document.querySelector("#modal-ecra-content label").classList.remove('btn-disabled')
            },
            hide: () =>
            {
                // document.getElementById('modal-ecra') ? document.getElementById('modal-ecra').checked = false : document.getElementById('modal-ecra').checked = false
                document.querySelector("#modal-ecra-content label").classList.remove('btn-disabled')

            },
            cancel: () =>
            {
                document.getElementById('modal-ecra') ? document.getElementById('modal-ecra').checked = false : document.getElementById('modal-ecra').checked = false
                document.querySelector("#modal-ecra-content label").classList.remove('btn-disabled')
            }
        }
    },

    // ACTIVE TODO
    {
        id: 'active-todo',
        attachTo: { element: '#a1-test-todo', on: 'top' },
        beforeShowPromise: function ()
        {
            return new Promise(function (resolve)
            {
                setTimeout(function ()
                {
                    // window.scrollTo(0, 0);
                    resolve();
                }, 500);
            });
        },
        buttons: [
            {
                action()
                {
                    return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
            },
            {
                action()
                {
                    return this.next();
                },
                text: 'Next'
            }
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'Active Schedule',
        text: ['Your todo will be created over here. <i>This todo is just an example and will be removed after this tutorial.</i>'],
        when: {
            show: () =>
            {
                // console.log('show step');
            },
            hide: () =>
            {
                // console.log('hide step');
            }
        }
    },

    // MARK AS FINISHED BUTTON
    {
        id: 'mark-todo-as-finished',
        attachTo: { element: '#a1-test-todo-mark-as-finished', on: 'top' },
        // beforeShowPromise: function ()
        // {
        //     return new Promise(function (resolve)
        //     {
        //         setTimeout(function ()
        //         {
        //             window.scrollTo(0, 0);
        //             resolve();
        //         }, 1000);
        //     });
        // },
        buttons: [
            {
                action()
                {
                    return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
            },
            {
                action()
                {
                    return this.next();
                },
                text: 'Next'
            }
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'Mark As Finished',
        text: ['Click on this button to mark todo as finished'],
        when: {
            show: () =>
            {
                // console.log('show step');
            },
            hide: () =>
            {
                // console.log('hide step');
            }
        }
    },

    // INTRODUCE MARK AS FINISHED MODAL
    {
        id: 'introduce-mark-as-finished-modal',
        attachTo: { element: '#modal-maf-content', on: 'right' },
        beforeShowPromise: function ()
        {
            return new Promise(function (resolve)
            {
                setTimeout(function ()
                {
                    window.scrollTo(0, 0);
                    resolve();
                }, 500);
            });
        },
        buttons: [
            {
                action()
                {
                    document.getElementById('modal-maf') ? document.getElementById('modal-maf').checked = false : document.getElementById('modal-maf').checked = false
                    return this.back();
                },
                classes: 'shepherd-button-secondary',
                text: 'Back'
            },
            {
                action()
                {
                    return this.next();
                },
                text: 'Next'
            }
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'Mark As Finished',
        text: ['Click "Mark As Finished" to finish this tutorial'],
        when: {
            show: () =>
            {
                // console.log('show step');
            },
            hide: () =>
            {
                // console.log('hide step');
            }
        }
    },

    // THAT' IT
    {
        id: 'closing',
        attachTo: { element: '', on: 'top' },
        // beforeShowPromise: function ()
        // {
        //     return new Promise(function (resolve)
        //     {
        //         setTimeout(function ()
        //         {
        //             window.scrollTo(0, 0);
        //             resolve();
        //         }, 500);
        //     });
        // },
        buttons: [
            {
                action()
                {
                    return this.complete();
                },
                text: 'FINISH'
            }
        ],
        // classes: 'card w-96 shadow-xl',
        highlightClass: 'highlight',
        scrollTo: false,
        cancelIcon: {
            enabled: true,
        },
        title: 'THAT\'S IT',
        text: ['Your to-do is now finished and stored in <b>Past Schedules</b> section. You can do the same method to delete your to-do.'],
        when: {
            show: () =>
            {
                // console.log('show step');
            },
            hide: () =>
            {
                // console.log('hide step');
            }
        }
    },
];