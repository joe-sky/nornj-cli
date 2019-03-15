<#-template name="importLoadPage">
import #{pageName | capitalize}# from 'bundle-loader?lazy&name=[name]!./src/app/pages/#{pageName}#/#{pageName}##{!exName ?: ('.jsx', exName)}#';
//{importLoadPage}//
</#-template>

<#-template name="FUNC_COMPONENTS">
#{pageName | capitalize}#: {
    //icon: require('./src/app/images/icon-default.png'),
    component: #{pageName | capitalize}#
  },
  //{FUNC_COMPONENTS}//
</#-template>