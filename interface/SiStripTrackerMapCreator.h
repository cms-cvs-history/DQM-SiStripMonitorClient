#ifndef _SiStripTrackerMapCreator_h_
#define _SiStripTrackerMapCreator_h_

#include "DQMServices/Core/interface/MonitorUIRoot.h"
#include "DQMServices/Core/interface/MonitorElement.h"
#include "CondFormats/SiStripObjects/interface/SiStripFedCabling.h"
#include "FWCore/Framework/interface/ESHandle.h"
#include "FWCore/ParameterSet/interface/ParameterSet.h"

#include <fstream>
#include <map>
#include <vector>
#include <string>

class DaqMonitorBEInterface;

class SiStripTrackerMap;
class SiStripTrackerMapCreator {

 public:

  SiStripTrackerMapCreator();
 ~SiStripTrackerMapCreator();
  bool readConfiguration();

  void create(const edm::ParameterSet & tkmapPset, 
	      const edm::ESHandle<SiStripFedCabling>& fedcabling, 
              DaqMonitorBEInterface* bei);

  int getFrequency() { return tkMapFrequency_;}
  int getMENames(std::vector< std::string>& me_names);


 private:

  void paintTkMap(int det_id, std::map<MonitorElement*, int>& me_map);

  SiStripTrackerMap* trackerMap_;
  std::vector<std::string> meNames_;
  std::string tkMapName_;
  int tkMapFrequency_;
};
#endif
