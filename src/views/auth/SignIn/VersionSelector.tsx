import React, { useState } from 'react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
 
type VersionData = {
version_number: string;
release_date: string;
// status: 'active' | 'deprecated' | 'upcoming';
};
 
const versionDataSet: VersionData[] = [
    { version_number: 'v2.0.0', release_date: '2024-03-30'},
    { version_number: 'v1.1.0', release_date: '2024-02-15' },
    { version_number: 'v1.0.0', release_date: '2024-01-01' },

];
 
type Option = {
value: string;
label: string;
};
 
const getVersionOptions = (data: VersionData[]): Option[] => {
return data.map(item => ({
value: item.version_number,
label: `${item.version_number}`
}));
};
 
const VersionSelector: React.FC = () => {
const versionOptions = getVersionOptions(versionDataSet);
const [currentVersion, setCurrentVersion] = useState<string>(
versionOptions.find(opt =>
versionDataSet.find(v => v.version_number === opt.value)?.status === 'active'
)?.value || versionOptions[0]?.value
);
 
const handleVersionChange = (selectedOption: Option | null) => {
if (selectedOption) {
setCurrentVersion(selectedOption.value);
}
};
 
return (
<div className="absolute top-8 right-8">
<div className="flex gap-3 z-20">
<div className="w-40">
<OutlinedSelect
label="Version"
options={versionOptions}
value={versionOptions.find((option) => option.value === currentVersion)}
onChange={handleVersionChange}
/>
</div>
</div>
</div>
);
};
 
export default VersionSelector;