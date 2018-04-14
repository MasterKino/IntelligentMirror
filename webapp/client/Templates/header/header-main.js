import './header.css';

Template.headermain.events = {
    'click .js-toggleview'(event, instance) {
        FlowRouter.go(event.currentTarget.getAttribute('data-route'));
    }
}
