const opts = {
  mirrorClass: '.js-normalmirror',
  intelligentClass: '.js-intelligentmirror'
};

// function loadAdidasAnimation() {}

export default {
    onRendered: function() {
        // function showMirrorView() {
        // }
        //
        // function showIntelligentView() {
        // }

        // loadAdidasAnimation();
        //
        // this.find(opts.intelligentClass).addEventListener(
        //     'click',
        //     showIntelligentView
        // );
        // this.find(opts.mirrorClass).addEventListener('click', showMirrorView);
        console.log("--[Rendered]-----------");
    },
    events: {
        'click .js-normalmirror'(event, instance) {
            FlowRouter.go('mirror');
        },
        'click .js-intelligentmirror'(event, instance) {
            FlowRouter.go('productDetail');
        }
    }
};
