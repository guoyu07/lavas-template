<template>
    <div>
        <h2 class="gray--text">LAVAS</h2>
        <h4 class="gray--text">[ˈlɑ:vəz]</h4>
        <lavas-link to="/detail/1">detail</lavas-link>
        <div class="error-handle">
            <lavas-link to="/list">list(entry not exists)</lavas-link>
            <lavas-link to="/detail/abc/def">detail/abc/def(route not exists)</lavas-link>
        </div>
    </div>
</template>

<script>

function setState(store) {
}

export default {
    name: 'index',
    head: {
        title: 'Home',
        titleTemplate: '%s - Lavas',
        meta: [
            {name: 'keywords', content: 'lavas PWA'},
            {name: 'description', content: '基于 Vue 的 PWA 解决方案，帮助开发者快速搭建 PWA 应用，解决接入 PWA 的各种问题'}
        ]
    },
    async asyncData({store, route}) {
        setState(store);
    },
    activated() {
        setState(this.$store);
    }
};
</script>

<style lang="stylus" scoped>
h2
    margin-top 50%
    font-size 46px
    font-weight 500

.error-handle
    margin-top 100px

    a
        display block
</style>
