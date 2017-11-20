import React from 'react'
import { observer, inject } from 'mobx-react';

export default function BeforeRoute(Component) {

    @observer
    @inject("store")
    class HockRoute extends React.Component {
        componentWillMount () {
        }

        render () {
            return React.createElement(
                Component,
                { ...this.props }
            )
        }

    }

    return HockRoute
}