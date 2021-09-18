## IfcSpace and Georeference Check

1_IFCspaceAndGeoRefCheck.fmw

This workspace checks for IFC-files:

  -  if it contains IfcSpace
  -  its georeferencing capabilities

**Requirements**

This workspace utilized IfcGeoRefCheck, this can be downloaded from:

https://dd-bim.org/

**Input**

  - *InputFolder* - Folder which contains the to be validated IFC-file(s)
  - *GEOREF* - Path to IFCGeoRefChecked command executable

i.e. "C:\IfcGeoRefChecker_v3\IFCGeoRefCheckerCommand\bin\x64\Release\IFCGeoRefCheckerCommand.exe"

**Output**

A validation report (txt) in the input folder, with the results of the validation

**Custom Transformers**

  - IfcProjectCheck  xxx nog beschrijven en opslaan
  - IfcSpaceCheck
  - IfcGeoRef  xxx nog beschrijven en opslaan


## BIMIFC to DBMS

2_BIMIFCtoDBMS.fmw

This workspace is used to read IFC-file(s), coerce and validate the geometry, then write it to the DBMS.

**Requirements**

See the PostgreSQL dll to install the database.

**Input**

  - *PostgreSQL_CONNECTION* - Connection to the database
  - *InputFolder* - Folder which contains the to be validated IFC-file(s)



## Intersection Reader

3_Intersection.fmw

This workspace reads the materialized view which calculated the 3D_Intersection, than calculates the volumes of these volumes. Volumes > 0 are written to a .ffs

**Requirements**

See the PostgreSQL dll to install the database.

**Input**

  - *PostgreSQL_CONNECTION* - Connection to the database
  - *MATVIEW* - Materialized view name
  - *DestDataset_FFS* - Location to store the .ffs dataset


## Create LADM attributes

4_FictiveLDMAa.fmw / 4_FictiveLDMAb.fmw

This workspace reads the LA_LegalSpaceBuildingUnit table from PostgreSQL and generates LADM attributes, which are stored to the PostgreSQL DBMS.

**Requirements**

See the PostgreSQL dll to install the database.

**Input**

  - *PostgreSQL_CONNECTION* - Connection to the database

## DBMS to Cesium tiles

5_DBMStoCesiumtiles

This workspace is used to transform between DBMS and Cesium Tiles.

**Requirements**

See the PostgreSQL dll to install the database.

*The database connection is removed for security reasons. Please add connectors between the read 'BuildingElements' and 'Cesium_view'*

**Input**

  - *PostgreSQL_CONNECTION* - Connection to the database
  - *DestTiles* - Destionation of the tiles


# Custom Transformers


## IfcSpaceCheck

Read IfcSpace from IFC-file(s), use a NoFeaturesTester to test if features are read. Report the output to text_line_data for creating the validationreport.
