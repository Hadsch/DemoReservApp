

Ext.define('Overrides.ComponentQuery', {
    override: 'Ext.ComponentQuery',


    cache: new Ext.util.LruCache({
        maxSize: 100
    }),

    /**
     * Traverses the tree rooted at the passed root in pre-order mode, calling the passed function on the nodes at each level.
     * That is the function is called upon each node **before** being called on its children).
     *
     * For an object to be queryable, it must implement the `getRefItems` method which returns all
     * immediate child items.
     *
     * This method is used at each level down the cascade. Currently {@link Ext.Component Component}s
     * and {@link Ext.data.TreeModel TreeModel}s are queryable.
     *
     * If you have tree-structured data, you can make your nodes queryable, and use ComponentQuery on them.
     *
     * @param {Object} selector A ComponentQuery selector used to filter candidate nodes before calling the function.
     * An empty string matches any node.
     * @param {String} root The root queryable object to start from.
     * @param {Function} fn The function to call. Return `false` to abort the traverse.
     * @param {Object} fn.node The node being visited.
     * @param {Object} [scope] The context (`this` reference) in which the function is executed.
     * @param {Array} [extraArgs] A set of arguments to be appended to the function's argument list to pass down extra data known to the caller
     * **after** the node being visited.
     */
    visitPreOrder: function(selector, root, fn, scope, extraArgs) {
        this._visit(true, selector, root, fn, scope, extraArgs);
    },

    /**
     * Traverses the tree rooted at the passed root in post-order mode, calling the passed function on the nodes at each level.
     * That is the function is called upon each node **after** being called on its children).
     *
     * For an object to be queryable, it must implement the `getRefItems` method which returns all
     * immediate child items.
     *
     * This method is used at each level down the cascade. Currently {@link Ext.Component Component}s
     * and {@link Ext.data.TreeModel TreeModel}s are queryable.
     *
     * If you have tree-structured data, you can make your nodes queryable, and use ComponentQuery on them.
     *
     * @param {Object} selector A ComponentQuery selector used to filter candidate nodes before calling the function.
     * An empty string matches any node.
     * @param {String} root The root queryable object to start from.
     * @param {Function} fn The function to call. Return `false` to abort the traverse.
     * @param {Object} fn.node The node being visited.
     * @param {Object} [scope] The context (`this` reference) in which the function is executed.
     * @param {Array} [extraArgs] A set of arguments to be appended to the function's argument list to pass down extra data known to the caller
     * **after** the node being visited.
     */
    visitPostOrder: function(selector, root, fn, scope, extraArgs) {
        this._visit(false, selector, root, fn, scope, extraArgs);
    },

    // @private
    // visit implementation which handles both preOrder and postOrder modes.
    _visit: function(preOrder, selector, root, fn, scope, extraArgs) {
        var me = this,
            query = me.cache.get(selector),
            callArgs = [root],
            children,
            len = 0,
            i, rootMatch;

        if (!query) {
            query = me.cache.add(selector, me.parse(selector));
        }

        rootMatch = query.is(root);

        if (root.getRefItems) {
            children = root.getRefItems();
            len = children.length;
        }

        // append optional extraArgs
        if (extraArgs) {
            Ext.Array.push(callArgs, extraArgs);
        }
        if (preOrder) {
            if (rootMatch) {
                if (fn.apply(scope || root, callArgs) === false) {
                    return false;
                }
            }
        }
        for (i = 0; i < len; i++) {
            if (me._visit.call(me, preOrder, selector, children[i], fn, scope, extraArgs) === false) {
                return false;
            }
        }
        if (!preOrder) {
            if (rootMatch) {
                if (fn.apply(scope || root, callArgs) === false) {
                    return false;
                }
            }
        }
    }

});
