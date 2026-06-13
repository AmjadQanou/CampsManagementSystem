const fs = require('fs');
const path = require('path');

const filesToFix = {
  'Announcments.js': { var: 'announcments', tableName: 'الاعلانات' },
  'CampManagers.js': { var: 'campmanagers', tableName: 'مدير مخيم', props: '          searchValue={query}\n          setSearchValue={setQuery}' },
  'DPs.js': { var: 'DPs', tableName: 'نازح', tableComp: 'DpsTable', props: '          searchValue={query}\n          setSearchValue={setQuery}\n          onDelete={handleDelete}\n          columnOrder={dpsFieldOrder}' },
  'Displacment.js': { var: 'displacments', tableName: 'تغييرات المخيمات' },
  'DpsRelief.js': { var: 'DpsRelief', tableName: 'توزيع المساعدات', props: '          searchValue={query}\n          setSearchValue={setQuery}\n          hidebtn={hidebtn}\n          hideactions={hideactions}' },
  'HealthIssues.js': { var: 'healthIssues', tableName: 'الامراض', props: '          searchValue={query}\n          setSearchValue={setQuery}\n          hidebtn={hidebtn}\n          hideactions={hideactions}' },
  'Notifications.js': { var: 'notifications', tableName: 'اشعارات' },
  'Organization.js': { var: 'orgs', tableName: 'المؤسسات', props: '          searchValue={query}\n          setSearchValue={setQuery}\n          hidebtn={hidebtn}\n          hideactions={hideactions}' },
  'OrganizationManager.js': { var: 'orgmanagers', tableName: 'مدراء المؤسسات', props: '          hidebtn={hidebtn}\n          hideactions={hideactions}' },
  'ReliefRegister.js': { var: 'relifes', tableName: 'تسجيل المساعدات', props: '          url={"reliefreg"}\n          searchValue={query}\n          setSearchValue={setQuery}\n          hidebtn={hidebtn}\n          hideactions={hideactions}\n          showconfirm={showconfirm}' },
  'ReliefRequest.js': { var: 'reliefRequests', tableName: 'ReliefRequests', props: '          hidebtn={hidebtn}\n          hideactions={hideactions}\n          url={"reliefreq"}' },
  'ReliefTracking.js': { var: 'reliefTracking', tableName: 'تتبع المساعدات', props: '          url={"relietracking"}\n          hidebtn={hidebtn}\n          hideactions={hideactions}' },
};

const dir = path.join(__dirname, 'src', 'Lists');

for (const [file, config] of Object.entries(filesToFix)) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const compName = config.tableComp || 'Table';
    const props = config.props ? '\n' + config.props : '';
    
    const replacement = `  return (
    <div className="flex flex-col flex-1 w-full h-full bg-gray-50">
      {${config.var} ? (
        <${compName}
          tableName={"${config.tableName}"}
          list={${config.var}}
          columnsToExclude={columnsToExclude}${props}
        />
      ) : (
        <div className="flex items-center justify-center flex-1 min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
        </div>
      )}
    </div>
  );`;

    if (content.includes('return (  );')) {
      content = content.replace('return (  );', replacement);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${file}`);
    } else {
      console.log(`No match in ${file}`);
    }
  }
}
