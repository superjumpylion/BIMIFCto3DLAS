 SELECT sp.indexnr AS la_legalspacebuildingunit,
    sp.basename AS ifc_file,
    sp.longname AS space_longname,
    bu.la_bu AS la_buildingunit,
    rrr.rrr_id AS la_rrr,
    pr.party_id AS la_party,
    pr.name AS party_name,
    sp.geom
   FROM "LA_LSBU2" sp
    JOIN "LA_BU" bu ON sp.la_bu = bu.la_bu
    JOIN "LA_RRR" rrr ON bu.la_bu = rrr.la_bu
    JOIN "LA_PARTY" pr ON rrr.rrr_id = pr.rrr_id;