<?php/** * * * Zenbership Membership Software * Copyright (C) 2013-2016 Castlamp, LLC * * This program is free software: you can redistribute it and/or modify * it under the terms of the GNU General Public License as published by * the Free Software Foundation, either version 3 of the License, or * (at your option) any later version. * * This program is distributed in the hope that it will be useful, * but WITHOUT ANY WARRANTY; without even the implied warranty of * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the * GNU General Public License for more details. * * You should have received a copy of the GNU General Public License * along with this program.  If not, see <http://www.gnu.org/licenses/>. * * @author      Castlamp * @link        http://www.castlamp.com/ * @link        http://www.zenbership.com/ * @copyright   (c) 2013-2016 Castlamp * @license     http://www.gnu.org/licenses/gpl-3.0.en.html * @project     Zenbership Membership Software */// Check permissions, ownership,// and if it exists.$permission = 'employee-add';$check = $admin->check_permissions($permission, $employee);if ($check != '1') {    $admin->show_no_permissions($error, '', '1');} else {    $cid             = rand(100, 999999);    $field           = new field;    $final_form_col1 = $field->generate_form('employee-add', '', '1');    $final_form_col2 = $field->generate_form('employee-add', '', '2');    ?>    <script type="text/javascript">        $.ctrl('S', function () {            return json_add('employee-add', '<?php echo $cid; ?>', '0', 'slider_form');        });    </script>    <form action="" method="post" id="slider_form"          onsubmit="return json_add('employee-add','<?php echo $cid; ?>','0','slider_form');">        <div id="slider_submit">            <div class="pad24tb">                <div id="slider_right">                    <input type="submit" value="Save" class="save"/>                </div>                <div id="slider_left">                    <a href="null.php"                       onclick="return popup('profile_picture','id=<?php echo $cid; ?>&type=employee');"><img                            src="<?php echo PP_ADMIN; ?>/imgs/anon.png" width="48" height="48" border="0" alt=""                            title="" class="profile_pic border"/></a><span class="title">Creating Employee</span><span                        class="data">Click here to upload a picture for this employee.</span>                </div>                <div class="clear"></div>            </div>        </div>        <div id="primary_slider_content">            <div class="col50">                <div class="pad24_fs_l">                    <?php                    echo $final_form_col1;                    ?>                </div>            </div>            <div class="col50">                <div class="pad24_fs_r">                    <fieldset>                        <legend>Additional Details</legend>                        <div class="pad24t">                            <div class="field">                                <label>Status</label>                                <div class="field_entry">                                    <input type="radio" name="status" id="status" value="1" checked="checked"/> Active                                    <input type="radio" name="status" id="status" value="0"/> Inactive                                </div>                            </div>                            <div class="field">                                <label>Job Title<span class="req_star">*</span></label>                                <div class="field_entry">                                    <input type="text" name="occupation" id="occupation" value="" class="req"                                           style="width:90%;"/>                                </div>                            </div>                            <div class="field">                                <label>Department<span class="req_star">*</span></label>                                <div class="field_entry">                                    <select name="department" id="department" style="width:90%;" class="req">                                        <option value=""></option>                                        <?php                                        echo $admin->list_departments($data['department']);                                        ?>                                    </select>                                </div>                            </div>                            <div class="field">                                <label>Permissions<span class="req_star">*</span></label>                                <div class="field_entry">                                    <select name="permission_group" id="permission_group" style="width:90%;"                                            class="req">                                        <option value=""></option>                                        <?php                                        echo $admin->list_permission_groups();                                        ?>                                    </select>                                </div>                            </div>                            <div class="field">                                <label>Created</label>                                <div class="field_entry">                                    <?php                                    echo $af                                        ->setSpecialType('datetime')                                        ->setValue(current_date())                                        ->string('created');                                    //echo $admin->datepicker('created', current_date(), '1');                                    ?>                                </div>                            </div>                        </div>                    </fieldset>                    <?php                    echo $final_form_col2;                    ?>                </div>            </div>            <div class="clear"></div>        </div>    </form>    <script type="text/javascript" src="<?php echo PP_ADMIN; ?>/js/forms.js"></script><?php}?>