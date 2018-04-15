import './home.css';

Template.home.rendered = function() {
    console.log("--[Rendered]-----------");
    document.querySelector('.js-home').classList.add('loaded');
};

Template.home.events = {
    'click .js-normalmirror'(event, instance) {
        FlowRouter.go('mirror');
    },
    'click .js-intelligentmirror'(event, instance) {
        FlowRouter.go('productDetail');
    }
}
