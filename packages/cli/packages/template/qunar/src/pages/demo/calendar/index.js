import React from '@react';
import Calendar from '../../../components/calendar/index';
class P extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div class="calendar-containar">
                <Calendar />
            </div>
        );
    }
}

export default P;