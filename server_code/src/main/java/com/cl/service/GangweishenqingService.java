package com.cl.service;

import com.baomidou.mybatisplus.mapper.Wrapper;
import com.baomidou.mybatisplus.service.IService;
import com.cl.utils.PageUtils;
import com.cl.entity.GangweishenqingEntity;
import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;
import com.cl.entity.view.GangweishenqingView;


/**
 * 岗位申请
 *
 * @author 
 * @email 
 * @date 2024-04-05 14:26:20
 */
public interface GangweishenqingService extends IService<GangweishenqingEntity> {

    PageUtils queryPage(Map<String, Object> params);
    
   	List<GangweishenqingView> selectListView(Wrapper<GangweishenqingEntity> wrapper);
   	
   	GangweishenqingView selectView(@Param("ew") Wrapper<GangweishenqingEntity> wrapper);
   	
   	PageUtils queryPage(Map<String, Object> params,Wrapper<GangweishenqingEntity> wrapper);
   	

}

