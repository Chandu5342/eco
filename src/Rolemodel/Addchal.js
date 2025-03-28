
import React from "react"; 
function Addchal()
{
    return(
        <>
       <div class="table-container">
    <h3>Challenge List</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Challenge Name</th>
                <th>Challenge Type</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Recycle Plastic</td>
                <td>Recycling</td>
                <td>50</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Plant a Tree</td>
                <td>Environment</td>
                <td>100</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Donate Old Clothes</td>
                <td>Social</td>
                <td>75</td>
            </tr>
        </tbody>
    </table>
</div>
</>
    );
}
export default Addchal