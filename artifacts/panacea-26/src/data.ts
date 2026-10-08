export type EventItem={id:string;name:string;category:'Cultural'|'Sports'|'Academic'|'Pro Shows';description:string;type:string;date:string;time:string;venue:string;fee:string;eligibility:string;team:string;organizer:string;rules:string};
const make=(id:string,name:string,category:EventItem['category'],description:string,type='Competition'):EventItem=>({id,name,category,description,type,date:'Date TBA',time:'Time TBA',venue:'Venue TBA — GMC Kathua',fee:'Fee TBA',eligibility:'Eligibility details TBA',team:'Team size TBA',organizer:category==='Cultural'?'Aryeen Sharma':category==='Sports'?'Faizan Malik':'Antiksh Verma',rules:'Rules and instructions will be published by the organizers.'});
export const events:EventItem[]=[
make('dance','Dance','Cultural','A stage for movement, rhythm and the stories bodies can tell.'),
make('skit-drama','Skit & Drama','Cultural','Make a scene. Theatre, comic timing and a little beautiful chaos.'),
make('fashion-show','Fashion Show','Cultural','A runway for original ideas, styling and fearless presence.'),
make('factually-feral','Factually Feral','Cultural','A sharp-witted culture and knowledge face-off.','Show'),
make('cooking','Cooking Competition','Cultural','Bring your point of view to the kitchen and make it memorable.'),
make('singing','Singing Competition','Cultural','Solo and ensemble voices take the room.','Performance'),
make('treasure-hunt','Treasure Hunt','Cultural','Follow the clues, read the room and find your way through.','Team challenge'),
make('art-battle','Art Battle','Cultural','Make something vivid, under pressure, in good company.','Live art'),
make('guess-the-person','Guess the Person','Cultural','Recognize the clues; name the person.','Game'),
make('cricket','Cricket','Sports','Inter-college cricket tournament.','Tournament'),
make('football','Football','Sports','Inter-college football tournament.','Tournament'),
make('badminton','Badminton','Sports','Inter-college badminton tournament.','Tournament'),
make('basketball','Basketball','Sports','Inter-college basketball tournament.','Tournament'),
make('table-tennis','Table Tennis','Sports','Inter-college table tennis tournament.','Tournament'),
make('chess','Chess','Sports','A measured battle of plans and patience.','Tournament'),
make('mun','Model United Nations','Academic','Debate global questions through research, diplomacy and resolution.','Conference'),
make('medical-quiz','Medical Quiz','Academic','A knowledge challenge for curious medical minds.','Quiz'),
make('case-presentation','Case Presentation','Academic','Present a clinical case with clarity and a considered approach.','Presentation'),
make('surgical-workshop','Surgical Skills Workshop','Academic','A practical introduction to surgical skills. Workshop details TBA.','Workshop'),
make('medicine-workshop','Medicine Skills Workshop','Academic','A practical introduction to medicine skills. Workshop details TBA.','Workshop'),
make('paediatric-workshop','Paediatric Skills Workshop','Academic','A practical introduction to paediatric skills. Workshop details TBA.','Workshop'),
make('edm-night','EDM Night','Pro Shows','A full-volume night of electronic music. Performer and access details TBA.','Pro show'),
make('standup','Stand-up Comedy','Pro Shows','A night for sharp observations and a room full of laughter.','Pro show'),
make('headliner','Headliner Concert','Pro Shows','PANACEA’s headline live music moment. Artist announcement TBA.','Pro show'),
make('qawali','Qawali Night','Pro Shows','An evening of qawali and collective song. Artist and access details TBA.','Pro show')
];
export const categories=[
{name:'Cultural',tone:'pink',desc:'Dance · Drama · Fashion · Art · Song',icon:'✳'},
{name:'Sports',tone:'blue',desc:'Cricket · Football · Court · Chess',icon:'◉'},
{name:'Academic',tone:'yellow',desc:'MUN · Medical Quiz · Skills Workshops',icon:'✦'},
{name:'Pro Shows',tone:'dark-card',desc:'EDM · Comedy · Concert · Qawali',icon:'♫'}
];
export const days=[{date:'28 OCT',label:'DAY 01'},{date:'29 OCT',label:'DAY 02'},{date:'30 OCT',label:'DAY 03'},{date:'31 OCT',label:'DAY 04'}];
export const organizers=[
{role:'Cultural Secretary',name:'Aryeen Sharma',contact:'Contact details TBA'},
{role:'Sports Secretary',name:'Faizan Malik',contact:'Contact details TBA'},
{role:'Academic Secretary',name:'Antiksh Verma',contact:'Contact details TBA'}
];
export const culturalOrganizers='Nandini, Sukriti, Sharoon, Manjeet, Muskaan, Savri, Rashi, Redhanshi, Sandeep, Shakira, Sajid, Farhana, Inderpreet, Manshika, Shriya, Khwahish, Lakshita, Shreya, Harsharn, Iflah, Nikhil, Suneha, Mittali, Isha, Ritakshi, Hardikha, Mudassir, Shrishant, Inayat, Bupil, Ujwal, Shwnsham, Asim, Kunal, Harshdeep, Anushka, Akshad';
export const sportsOrganizers='Waqar, Sarwar, Sameer, Sadaat, Shubankar, Sarthak, Manazir, Tajamul, Uzair, Ayash, Ifham, Jamid, Afaan, Hanan, Furkaan, Kuldeep Meena, Aryan, Abhi Pranav, Saar, Shoaib, Sanamphreet, Harshdeep';
export const academicOrganizers='Tanya, Nitika, Aditya Vohra';
