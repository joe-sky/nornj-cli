<#-template name="importLoadPage">
import #{pageName | pascal}# from 'bundle-loader?lazy&name=[name]!./src/app/pages/#{pageName}#/#{pageName}##{!exName ?: ('.jsx', exName)}#';
//{importLoadPage}//
</#-template>

<#-template name="FUNC_COMPONENTS">
#{pageName | pascal}#: {
    //icon: require('./src/app/images/icon-default.png'),
    component: #{pageName | pascal}#
  },
  //{FUNC_COMPONENTS}//
</#-template>